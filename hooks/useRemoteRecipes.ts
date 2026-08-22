import { useCallback, useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { recipes as fallbackRecipes } from "@/data/recipes";

export function useRemoteRecipes() {
  const [list, setList] = useState<Recipe[]>(fallbackRecipes);
  const [loading, setLoading] = useState(false);
  const [fromRemote, setFromRemote] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFromRemote(false);
    setList(fallbackRecipes);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const byId = useMemo(() => new Map(list.map((r) => [r.recipe_id, r])), [list]);

  return { recipes: list, loading, fromRemote, refresh, getById: (id: string) => byId.get(id) };
}
