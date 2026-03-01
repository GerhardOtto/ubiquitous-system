"use client";

import { useRouter } from "next/navigation";
import { createItem } from "@/lib/storage";
import { seedItems } from "@/data/items";
import { ItemForm } from "@/app/components/item-form";

export default function NewItemPage() {
  const router = useRouter();

  return (
    <ItemForm
      onSave={(item) => {
        createItem(item, seedItems);
        router.push(`/items/${item.id}`);
      }}
      onCancel={() => router.back()}
    />
  );
}
