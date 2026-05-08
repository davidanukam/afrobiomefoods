import { useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/data/recipes";
import { recipes as fallbackRecipes } from "@/data/recipes";

export function useRemoteRecipes() {
  const [list, setList] = useState<Recipe[]>(fallbackRecipes);
  const [loading, setLoading] = useState(false);
  const [fromRemote, setFromRemote] = useState(false);

  useEffect(() => {
    setLoading(false);
    setFromRemote(false);
    setList(fallbackRecipes);
  }, []);

  const byId = useMemo(() => new Map(list.map((r) => [r.recipe_id, r])), [list]);

  return { recipes: list, loading, fromRemote, getById: (id: string) => byId.get(id) };
}
