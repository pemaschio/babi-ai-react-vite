import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Theater, Play } from "lucide-react";
import { formatDate } from "@/lib/utils";

const methodologies = [
  { value: "bant", label: "BANT" },
  { value: "spin", label: "SPIN Selling" },
  { value: "storytelling", label: "Storytelling" },
  { value: "slow_pressure", label: "Slow Pressure Selling" },
];

const scenarios = [
  "Cold call para diretor comercial",
  "Superacao de objecao de preco",
  "Qualificacao de lead inbound",
  "Fechamento de proposta complexa",
  "Negociacao com procurement",
];

export function RolePlay() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [scenario, setScenario] = useState(scenarios[0]);
  const [methodology, setMethodology] = useState("bant");

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => apiRequest("/api/roleplay"),
  });

  const startMutation = useMutation({
    mutationFn: (data: { scenario: string; methodology: string }) =>
      apiRequest("/api/roleplay/start", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleplays"] });
      setShowForm(false);
    },
  });

  const list = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Play</h1>
          <p className="text-text-muted mt-1">
            Simulacoes de vendas com feedback da IA
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center gap-2"
        >
          <Play size={18} />
          Nova Simulacao
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Configurar Role Play</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Cenario
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
            >
              {scenarios.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Metodologia
            </label>
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
            >
              {methodologies.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => startMutation.mutate({ scenario, methodology })}
            disabled={startMutation.isPending}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {startMutation.isPending ? "Iniciando..." : "Iniciar Role Play"}
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-text-muted">Carregando...</p>
      ) : list.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Theater size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhum role play ainda
          </h3>
          <p className="text-text-muted text-sm">
            Clique em "Nova Simulacao" para comecar a praticar!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(
            (s: {
              id: string;
              scenario: string;
              methodology: string;
              status: string;
              score: number | null;
              createdAt: string;
            }) => (
              <div
                key={s.id}
                className="bg-card rounded-xl border border-border p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Theater size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{s.scenario}</p>
                    <p className="text-xs text-text-muted">
                      {s.methodology?.toUpperCase()} •{" "}
                      {formatDate(s.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.score !== null && (
                    <span className="text-lg font-bold text-primary">
                      {s.score}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      s.status === "active"
                        ? "bg-success/10 text-success"
                        : s.status === "completed"
                          ? "bg-primary/10 text-primary"
                          : "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {s.status === "active"
                      ? "Em andamento"
                      : s.status === "completed"
                        ? "Finalizado"
                        : s.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
