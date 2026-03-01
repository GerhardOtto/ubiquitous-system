"use client";

import { useState } from "react";
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";

type ItemFormProps = {
  item?: Item;
  onSave: (item: Item) => void;
  onCancel: () => void;
};

function emptyDraft(): Item {
  return {
    id: crypto.randomUUID(),
    name: "",
    status: "pending",
    category: "",
    owner: "",
    updatedAt: new Date().toISOString(),
  };
}

export function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const isCreateMode = item === undefined;
  const [draft, setDraft] = useState<Item>(() =>
    item ? { ...item } : emptyDraft()
  );
  const [isEditing, setIsEditing] = useState(isCreateMode);

  function handleEdit() {
    setDraft(item ? { ...item } : emptyDraft());
    setIsEditing(true);
  }

  function handleCancel() {
    if (isCreateMode) {
      onCancel();
    } else {
      setDraft(item ? { ...item } : emptyDraft());
      setIsEditing(false);
    }
  }

  function handleSave() {
    const saved = { ...draft, updatedAt: new Date().toISOString() };
    onSave(saved);
    if (!isCreateMode) {
      setIsEditing(false);
    }
  }

  function handleChange(field: keyof Omit<Item, "id">, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  const displayItem = isCreateMode ? draft : item!;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft /> Back
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                {!isCreateMode && (
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X /> Cancel
                  </Button>
                )}
                <Button size="sm" onClick={handleSave}>
                  <Save /> {isCreateMode ? "Create" : "Save"}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleEdit}>
                <Pencil /> Edit
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isCreateMode
                ? draft.name || "New Item"
                : isEditing
                  ? draft.name || "Edit Item"
                  : displayItem.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="field-id">UUID</Label>
                <Input
                  id="field-id"
                  value={draft.id}
                  readOnly
                  className="font-mono text-xs text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-name">Name</Label>
                <Input
                  id="field-name"
                  value={isEditing ? draft.name : displayItem.name}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-category">Category</Label>
                <Input
                  id="field-category"
                  value={isEditing ? draft.category : displayItem.category}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-owner">Owner</Label>
                <Input
                  id="field-owner"
                  value={isEditing ? (draft.owner ?? "") : (displayItem.owner ?? "")}
                  readOnly={!isEditing}
                  placeholder="—"
                  onChange={(e) => handleChange("owner", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-status">Status</Label>
                {isEditing ? (
                  <Select
                    value={draft.status}
                    onValueChange={(v) =>
                      handleChange("status", v as Item["status"])
                    }
                  >
                    <SelectTrigger id="field-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="field-status" value={displayItem.status} readOnly />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-updated">Updated At</Label>
                <Input
                  id="field-updated"
                  value={
                    isEditing
                      ? draft.updatedAt
                      : new Date(displayItem.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                  }
                  readOnly
                  className="font-mono text-xs text-muted-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
