import { describe, it, expect, beforeEach } from "vitest";
import { createItem, updateItem, deleteItem, loadItems } from "./storage";
import { Item } from "@/types/item";

const seed: Item[] = [
  { id: "1", name: "Seed Item", status: "active", category: "A", updatedAt: "2024-01-01T00:00:00.000Z" },
];

beforeEach(() => {
  localStorage.clear();
});

describe("createItem", () => {
  it("appends a new item to an empty store", () => {
    const newItem: Item = { id: "2", name: "New", status: "pending", category: "B", updatedAt: "2024-01-02T00:00:00.000Z" };
    createItem(newItem, seed);
    const items = loadItems(seed);
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.id === "2")).toEqual(newItem);
  });

  it("preserves existing items when creating", () => {
    const first: Item = { id: "2", name: "First", status: "active", category: "A", updatedAt: "2024-01-01T00:00:00.000Z" };
    const second: Item = { id: "3", name: "Second", status: "inactive", category: "B", updatedAt: "2024-01-02T00:00:00.000Z" };
    createItem(first, seed);
    createItem(second, seed);
    const items = loadItems(seed);
    expect(items).toHaveLength(3);
  });
});

describe("updateItem", () => {
  it("updates an existing item by id", () => {
    const updated: Item = { ...seed[0], name: "Updated Name", status: "inactive" };
    updateItem(updated, seed);
    const items = loadItems(seed);
    expect(items[0].name).toBe("Updated Name");
    expect(items[0].status).toBe("inactive");
  });

  it("does not change item count when updating", () => {
    const updated: Item = { ...seed[0], name: "Changed" };
    updateItem(updated, seed);
    expect(loadItems(seed)).toHaveLength(1);
  });

  it("ignores update for unknown id", () => {
    const ghost: Item = { id: "999", name: "Ghost", status: "active", category: "Z", updatedAt: "2024-01-01T00:00:00.000Z" };
    updateItem(ghost, seed);
    // seed not yet persisted, so loadItems returns seed — length unchanged
    expect(loadItems(seed)).toHaveLength(1);
  });
});

describe("deleteItem", () => {
  it("removes an item by id", () => {
    deleteItem("1", seed);
    const items = loadItems(seed);
    expect(items.find((i) => i.id === "1")).toBeUndefined();
  });

  it("reduces item count by one", () => {
    const extra: Item = { id: "2", name: "Extra", status: "active", category: "A", updatedAt: "2024-01-01T00:00:00.000Z" };
    createItem(extra, seed);
    deleteItem("1", seed);
    expect(loadItems(seed)).toHaveLength(1);
  });

  it("is a no-op for an unknown id", () => {
    deleteItem("999", seed);
    // localStorage never written with seed data, so falls back to seed
    expect(loadItems(seed)).toHaveLength(1);
  });
});
