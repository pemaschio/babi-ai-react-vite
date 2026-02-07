import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3 } from "lucide-react";

export function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiRequest("/api/analytics"),
  });

  const list = Array.isArray(analytics) ? analytics : [];

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
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted mt-1">
          Metricas e relatorios de performance
        </p>
      </div>

      {list.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <BarChart3 size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Sem dados ainda</h3>
          <p className="text-text-muted text-sm">
            As metricas aparecerão conforme voce usar a plataforma.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(
            (item: {
              id: string;
              metricName: string;
              metricValue: string;
              recordedAt: string;
            }) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <p className="text-sm text-text-muted font-medium uppercase tracking-wide">
                  {item.metricName}
                </p>
                <p className="text-3xl font-bold text-text mt-2">
                  {item.metricValue}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
