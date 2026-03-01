import { Item } from "@/types/item";

const STORAGE_KEY = "admin-items";

export function loadItems(seedData: Item[]): Item[] {
  if (typeof window === "undefined") return seedData;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return seedData;
  try {
    return JSON.parse(stored) as Item[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return seedData;
  }
}

export function saveItems(items: Item[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function updateItem(updated: Item, seedData: Item[]): void {
  const items = loadItems(seedData);
  const index = items.findIndex((item) => item.id === updated.id);
  if (index !== -1) {
    items[index] = updated;
    saveItems(items);
  }
}
