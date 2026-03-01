import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-8xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Crypto Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Admin Dashboard
          </p>
        </div>
        <Avatar size="lg">
          <AvatarImage src="https://api.dicebear.com/9.x/bottts/svg?seed=altcoin" alt="Avatar" />
          <AvatarFallback>CT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
