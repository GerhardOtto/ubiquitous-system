export type Item = {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  category: string;
  owner?: string;
  updatedAt: string; // ISO string
};
