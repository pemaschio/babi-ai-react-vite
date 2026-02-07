import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const roles = [
  { value: "sdr", label: "SDR" },
  { value: "closer", label: "Closer" },
  { value: "account_executive", label: "Account Executive" },
  { value: "manager", label: "Gestor de Vendas" },
];

export function Profile() {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("sdr");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiRequest("/api/profile"),
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setCompany(profile.company || "");
      setRole(profile.role || "sdr");
      setPhone(profile.phone || "");
      setWhatsappNumber(profile.whatsappNumber || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("/api/profile", "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-text-muted mt-1">
          Gerencie seus dados e preferencias
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nome completo
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Empresa</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nome da empresa"
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Cargo</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Telefone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="11999998888"
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            WhatsApp
          </label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="5511999998888"
            className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              updateMutation.mutate({
                fullName,
                company,
                role,
                phone,
                whatsappNumber,
                onboardingCompleted: true,
              })
            }
            disabled={updateMutation.isPending}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar"}
          </button>
          {saved && (
            <span className="text-sm text-success font-medium">
              Perfil atualizado!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
