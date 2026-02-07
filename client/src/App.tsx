import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Conversations } from "@/pages/Conversations";
import { RolePlay } from "@/pages/RolePlay";
import { Knowledge } from "@/pages/Knowledge";
import { Analytics } from "@/pages/Analytics";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";

function AppRoutes() {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">babi.ai</h1>
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <Routes>
      <Route
        element={
          <MainLayout userEmail={user.email} onSignOut={signOut} />
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/roleplay" element={<RolePlay />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
