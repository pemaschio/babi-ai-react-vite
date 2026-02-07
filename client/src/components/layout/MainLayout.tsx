import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/conversations": "Conversas",
  "/roleplay": "Role Play",
  "/knowledge": "Base de Conhecimento",
  "/analytics": "Analytics",
  "/profile": "Meu Perfil",
  "/settings": "Configuracoes",
};

interface MainLayoutProps {
  userEmail?: string;
  onSignOut: () => void;
}

export function MainLayout({ userEmail, onSignOut }: MainLayoutProps) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "babi.ai";

  return (
    <div className="flex min-h-screen">
      <Sidebar onSignOut={onSignOut} />
      <div className="flex-1 flex flex-col">
        <Header title={title} userEmail={userEmail} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
