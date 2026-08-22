import { useCallback, useEffect, useState } from "react";
import type { CommunityPost } from "@/data/community";
import { communityPosts as fallbackPosts } from "@/data/community";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapCommunityRow } from "@/lib/supabase/mappers";

export function useRemoteCommunity() {
  const [list, setList] = useState<CommunityPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [fromRemote, setFromRemote] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setList(fallbackPosts);
      setFromRemote(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("community_posts").select("*");
    if (error || !data?.length) {
      setList(fallbackPosts);
      setFromRemote(false);
      setLoading(false);
      return;
    }
    const mapped = data
      .map((row) => mapCommunityRow(row.id, row as unknown as Record<string, unknown>))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setList(mapped.length > 0 ? mapped : fallbackPosts);
    setFromRemote(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();

    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseClient();
    const channelName = `public:community_posts:${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { posts: list, loading, fromRemote, refresh };
}
