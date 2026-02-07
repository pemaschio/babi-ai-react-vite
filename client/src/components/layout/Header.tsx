import { User } from "lucide-react";

interface HeaderProps {
  title: string;
  userEmail?: string;
}

export function Header({ title, userEmail }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted">{userEmail}</span>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>
      </div>
    </header>
  );
}
