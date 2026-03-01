"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/types/item";

export type StatusFilter = "all" | Item["status"];

interface ItemsToolbarProps {
  filter: StatusFilter;
  search: string;
  onFilterChange: (filter: StatusFilter) => void;
  onSearchChange: (search: string) => void;
  totalCount: number;
  filteredCount: number;
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
];

export default function ItemsToolbar({
  filter,
  search,
  onFilterChange,
  onSearchChange,
  totalCount,
  filteredCount,
}: ItemsToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "outline"}
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Input
          className="w-84"
          placeholder="Search by name, category, owner…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} items 
      </p>
    </div>
  );
}
