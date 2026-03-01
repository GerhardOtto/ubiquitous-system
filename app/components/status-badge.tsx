import { cn } from "@/lib/utils";
import { Item } from "@/types/item";

interface StatusBadgeProps {
  status: Item["status"];
}

const statusStyles: Record<Item["status"], string> = {
  active: "bg-primary text-primary-foreground",
  pending: "bg-accent text-accent-foreground",
  inactive: "bg-muted text-muted-foreground",
};

const statusLabels: Record<Item["status"], string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
