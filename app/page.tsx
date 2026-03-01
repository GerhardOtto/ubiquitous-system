"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Item } from "@/types/item";
import { loadItems, saveItems } from "@/lib/storage";
import ItemsToolbar, { StatusFilter } from "@/app/components/items-toolbar";
import ItemsDataTable, { SortDir, SortKey } from "@/app/components/items-data-table";
import { seedItems } from "@/data/items";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(loadItems(seedItems));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = items
    .filter((item) => filter === "all" || item.status === filter)
    .filter((item) => {
      if (search.trim() === "") return true;
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.owner ?? "").toLowerCase().includes(q)
      );
    });

  const sortedItems = sortKey
    ? [...filteredItems].sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      })
    : filteredItems;

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const pagedItems = sortedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleFilterChange(f: StatusFilter) {
    setFilter(f);
    setCurrentPage(1);
  }

  function handleSearchChange(s: string) {
    setSearch(s);
    setCurrentPage(1);
  }

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
    setCurrentPage(1);
  }

  function handleBulkStatusUpdate(ids: string[], status: Item["status"]) {
    const updated = items.map((item) =>
      ids.includes(item.id) ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );
    setItems(updated);
    saveItems(updated);
  }

  return (
    <main className="mx-auto max-w-8xl px-4 py-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <ItemsToolbar
            filter={filter}
            search={search}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            totalCount={items.length}
            filteredCount={filteredItems.length}
          />
          <Button asChild size="sm" className="shrink-0">
            <Link href="/items/new"><Plus /> Add Item</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : (
            <ItemsDataTable
              items={pagedItems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onBulkStatusUpdate={handleBulkStatusUpdate}
            />
          )}
        </div>
      </div>
    </main>
  );
}
