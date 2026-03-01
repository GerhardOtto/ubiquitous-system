"use client";

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
}

const columns: { key: SortKey; label: string; className: string }[] = [
  { key: "name", label: "Name", className: "w-[30%]" },
  { key: "category", label: "Category", className: "w-[20%]" },
  { key: "owner", label: "Owner", className: "w-[20%]" },
  { key: "status", label: "Status", className: "w-[15%]" },
  { key: "updatedAt", label: "Updated", className: "w-[15%]" },
];

export default function ItemsDataTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
}: ItemsDataTableProps) {
  const router = useRouter();
  return (
    <div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
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
                colSpan={5}
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
    </div>
  );
}
