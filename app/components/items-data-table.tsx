"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/types/item";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import StatusBadge from "@/app/components/status-badge";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type SortKey = keyof Pick<Item, "name" | "category" | "owner" | "status" | "updatedAt">;
export type SortDir = "asc" | "desc";

interface ItemsDataTableProps {
  items: Item[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onBulkStatusUpdate: (ids: string[], status: Item["status"]) => void;
}

const columns: { key: SortKey; label: string; className: string }[] = [
  { key: "name", label: "Name", className: "w-[28%]" },
  { key: "category", label: "Category", className: "w-[18%]" },
  { key: "owner", label: "Owner", className: "w-[18%]" },
  { key: "status", label: "Status", className: "w-[14%]" },
  { key: "updatedAt", label: "Updated", className: "w-[14%]" },
];

export default function ItemsDataTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
  onBulkStatusUpdate,
}: ItemsDataTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Item["status"] | "">("");

  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);

  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }

  function toggleOne(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleApply() {
    if (!pendingStatus) return;
    onBulkStatusUpdate([...selectedIds], pendingStatus as Item["status"]);
    setDialogOpen(false);
    setSelectedIds(new Set());
    setPendingStatus("");
  }

  return (
    <div>
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/40 text-sm">
          <span className="text-muted-foreground">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            Change Status
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="cursor-pointer accent-primary"
              />
            </TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("cursor-pointer select-none", col.className)}
                onClick={() => onSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  <span className="w-[14px] shrink-0">
                    {sortKey === col.key ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    ) : (
                      <ChevronsUpDown size={14} className="text-muted-foreground/50" />
                    )}
                  </span>
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => router.push(`/items/${item.id}`)}
              >
                <TableCell onClick={(e) => toggleOne(item.id, e)}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => {}}
                    className="cursor-pointer accent-primary"
                  />
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {item.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.category}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.owner ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="border-t border-border px-4 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={cn(
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change status for {selectedIds.size} selected item{selectedIds.size !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as Item["status"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter showCloseButton>
            <Button onClick={handleApply} disabled={!pendingStatus}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
