import { useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { recipes as fallbackRecipes } from "@/data/recipes";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapRecipeDoc } from "@/lib/supabase/mappers";

type RecipeRow = {
  id: string;
  source_id: string | null;
  doc: Record<string, unknown> | null;
};

export function useRemoteRecipes() {
  const [list, setList] = useState<Recipe[]>(fallbackRecipes);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [fromRemote, setFromRemote] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setFromRemote(false);
      setList(fallbackRecipes);
      return;
    }

    const supabase = getSupabaseClient();

    const load = async () => {
      const { data, error } = await supabase.from("recipes").select("id, source_id, doc");
      if (error || !data?.length) {
        setList(fallbackRecipes);
        setFromRemote(false);
        setLoading(false);
        return;
      }
      const mapped = (data as RecipeRow[])
        .map((row) => mapRecipeDoc(row.source_id || row.id, (row.doc ?? {}) as Record<string, unknown>))
        .sort((a, b) => a.name_en.localeCompare(b.name_en));
      setList(mapped.length > 0 ? mapped : fallbackRecipes);
      setFromRemote(true);
      setLoading(false);
    };

    void load();

    const channelName = `public:recipes:${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "recipes" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const byId = useMemo(() => new Map(list.map((r) => [r.recipe_id, r])), [list]);

  return { recipes: list, loading, fromRemote, getById: (id: string) => byId.get(id) };
}
