"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Item } from "@/types/item";
import { loadItems, updateItem, deleteItem } from "@/lib/storage";
import { seedItems } from "@/data/items";
import { ItemForm } from "@/app/components/item-form";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const items = loadItems(seedItems);
      const found = items.find((i) => i.id === id) ?? null;
      setItem(found);
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Loading...
        </div>
      </main>
    );
  }

  if (!item) notFound();

  return (
    <ItemForm
      item={item}
      onSave={(saved) => {
        updateItem(saved, seedItems);
        setItem(saved);
        toast.success(`"${saved.name}" updated`);
      }}
      onCancel={() => router.back()}
      onDelete={(deleted) => {
        deleteItem(deleted.id, seedItems);
        toast.success(`"${deleted.name}" deleted`);
        router.back();
      }}
    />
  );
}
