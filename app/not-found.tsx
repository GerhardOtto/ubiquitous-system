import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <FileQuestion className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">404 – Page not found</h1>
      <Button variant="outline" asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
