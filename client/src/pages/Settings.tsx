import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiRequest("/api/settings"),
  });

  const list = Array.isArray(settings) ? settings : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-text-muted mt-1">
          Parametros do sistema e da IA
        </p>
      </div>

      {list.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <SettingsIcon
            size={48}
            className="text-text-muted mx-auto mb-4"
          />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma configuracao
          </h3>
          <p className="text-text-muted text-sm">
            As configuracoes do sistema aparecerao aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(
            (s: {
              id: string;
              key: string;
              value: unknown;
              description: string | null;
            }) => (
              <div
                key={s.id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-mono text-sm">{s.key}</p>
                    {s.description && (
                      <p className="text-xs text-text-muted mt-1">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <pre className="text-xs bg-background p-2 rounded max-w-xs overflow-auto">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
