import { useEffect, useState } from "react";
import type { ServiceItem } from "@/data/services";
import { services as fallbackServices } from "@/data/services";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapServiceDoc } from "@/lib/supabase/mappers";

export function useRemoteServices() {
  const [list, setList] = useState<ServiceItem[]>(fallbackServices);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [fromRemote, setFromRemote] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setList(fallbackServices);
      return;
    }

    const supabase = getSupabaseClient();

    const load = async () => {
      const { data, error } = await supabase.from("services").select("id, doc");
      if (error || !data?.length) {
        setList(fallbackServices);
        setFromRemote(false);
        setLoading(false);
        return;
      }
      const mapped = data.map((row) => mapServiceDoc(row.id, (row.doc ?? {}) as Record<string, unknown>));
      setList(mapped.length > 0 ? mapped : fallbackServices);
      setFromRemote(true);
      setLoading(false);
    };

    void load();

    const channelName = `public:services:${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return { services: list, loading, fromRemote };
}
