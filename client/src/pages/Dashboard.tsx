import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  MessageCircle,
  Theater,
  TrendingUp,
  BookOpen,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <p className="text-sm text-text-muted font-medium">{label}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiRequest("/api/conversations"),
  });

  const { data: roleplays } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => apiRequest("/api/roleplay"),
  });

  const { data: knowledge } = useQuery({
    queryKey: ["knowledge"],
    queryFn: () => apiRequest("/api/knowledge"),
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiRequest("/api/analytics"),
  });

  const totalConversations = Array.isArray(conversations)
    ? conversations.length
    : 0;
  const totalRoleplays = Array.isArray(roleplays) ? roleplays.length : 0;
  const totalKnowledge = Array.isArray(knowledge) ? knowledge.length : 0;
  const avgScore = Array.isArray(roleplays) && roleplays.length > 0
    ? Math.round(
        roleplays
          .filter((r: { score: number | null }) => r.score !== null)
          .reduce((sum: number, r: { score: number }) => sum + r.score, 0) /
          Math.max(
            roleplays.filter((r: { score: number | null }) => r.score !== null).length,
            1
          )
      )
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Bem-vindo ao babi.ai</h1>
        <p className="text-text-muted mt-1">
          Acompanhe seu progresso e acesse suas ferramentas de mentoria
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MessageCircle}
          label="Conversas"
          value={totalConversations}
          color="#6366f1"
        />
        <StatCard
          icon={Theater}
          label="Role Plays"
          value={totalRoleplays}
          color="#8b5cf6"
        />
        <StatCard
          icon={TrendingUp}
          label="Score Medio"
          value={avgScore > 0 ? `${avgScore}/100` : "--"}
          color="#10b981"
        />
        <StatCard
          icon={BookOpen}
          label="Conhecimento"
          value={totalKnowledge}
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Conversas Recentes</h3>
          {totalConversations === 0 ? (
            <p className="text-text-muted text-sm">
              Nenhuma conversa ainda. Inicie uma mentoria pelo WhatsApp!
            </p>
          ) : (
            <div className="space-y-3">
              {(conversations as Array<{ id: string; whatsappNumber: string; status: string; createdAt: string }>)
                ?.slice(0, 5)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2 border-b border-border-light last:border-0"
                  >
                    <span className="text-sm">{c.whatsappNumber}</span>
                    <span className="text-xs text-text-muted capitalize">
                      {c.status}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">
            Ultimos Role Plays
          </h3>
          {totalRoleplays === 0 ? (
            <p className="text-text-muted text-sm">
              Nenhum role play ainda. Comece uma simulacao!
            </p>
          ) : (
            <div className="space-y-3">
              {(roleplays as Array<{ id: string; scenario: string; methodology: string; score: number | null }>)
                ?.slice(0, 5)
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-2 border-b border-border-light last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{r.scenario}</p>
                      <p className="text-xs text-text-muted capitalize">
                        {r.methodology}
                      </p>
                    </div>
                    {r.score !== null && (
                      <span className="text-sm font-semibold text-primary">
                        {r.score}/100
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
