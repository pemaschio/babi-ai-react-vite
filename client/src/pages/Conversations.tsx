import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function Conversations() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiRequest("/api/conversations"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Carregando...</p>
      </div>
    );
  }

  const list = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conversas</h1>
        <p className="text-text-muted mt-1">
          Historico de conversas via WhatsApp
        </p>
      </div>

      {list.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <MessageCircle
            size={48}
            className="text-text-muted mx-auto mb-4"
          />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma conversa ainda
          </h3>
          <p className="text-text-muted text-sm">
            Suas conversas com a babi.ai via WhatsApp aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(
            (c: {
              id: string;
              whatsappNumber: string;
              status: string;
              createdAt: string;
              updatedAt: string;
            }) => (
              <div
                key={c.id}
                className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{c.whatsappNumber}</p>
                    <p className="text-xs text-text-muted">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    c.status === "active"
                      ? "bg-success/10 text-success"
                      : c.status === "ended"
                        ? "bg-text-muted/10 text-text-muted"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  {c.status === "active"
                    ? "Ativa"
                    : c.status === "ended"
                      ? "Finalizada"
                      : "Pausada"}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
