import { useCallback, useEffect, useState } from "react";
import type { EventItem } from "@/data/events";
import { events as fallbackEvents } from "@/data/events";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapEventDoc } from "@/lib/supabase/mappers";

export function useRemoteEvents() {
  const [list, setList] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [fromRemote, setFromRemote] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setList(fallbackEvents);
      setFromRemote(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("events").select("id, doc");
    if (error || !data?.length) {
      setList(fallbackEvents);
      setFromRemote(false);
      setLoading(false);
      return;
    }
    const mapped = data
      .map((row) => mapEventDoc(row.id, (row.doc ?? {}) as Record<string, unknown>))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setList(mapped.length > 0 ? mapped : fallbackEvents);
    setFromRemote(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();

    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseClient();
    const channelName = `public:events:${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { events: list, loading, fromRemote, refresh };
}
