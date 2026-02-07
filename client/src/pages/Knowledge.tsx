import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function Knowledge() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["knowledge"],
    queryFn: () => apiRequest("/api/knowledge"),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: string }) =>
      apiRequest("/api/knowledge", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      setShowForm(false);
      setTitle("");
      setContent("");
      setCategory("");
    },
  });

  const list = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Base de Conhecimento</h1>
          <p className="text-text-muted mt-1">
            Materiais e metodologias de vendas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Adicionar
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Novo Item</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Titulo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Framework BANT"
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Categoria
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Metodologia"
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Conteudo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o conteudo..."
              rows={5}
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button
            onClick={() =>
              createMutation.mutate({ title, content, category })
            }
            disabled={!title || !content || createMutation.isPending}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-text-muted">Carregando...</p>
      ) : list.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Base vazia
          </h3>
          <p className="text-text-muted text-sm">
            Adicione materiais, scripts e metodologias para consulta da IA.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(
            (item: {
              id: string;
              title: string;
              category: string;
              content: string;
              createdAt: string;
            }) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.category && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted line-clamp-3 whitespace-pre-wrap">
                  {item.content}
                </p>
                <p className="text-xs text-text-muted mt-3">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
