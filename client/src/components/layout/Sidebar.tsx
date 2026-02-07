import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Theater,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/conversations", icon: MessageCircle, label: "Conversas" },
  { to: "/roleplay", icon: Theater, label: "Role Play" },
  { to: "/knowledge", icon: BookOpen, label: "Conhecimento" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/profile", icon: Users, label: "Perfil" },
  { to: "/settings", icon: Settings, label: "Configuracoes" },
];

interface SidebarProps {
  onSignOut: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">babi.ai</h1>
        <p className="text-sm text-white/50 mt-1">Mentora de Vendas IA</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-sidebar-hover hover:text-white"
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-sidebar-hover hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}
