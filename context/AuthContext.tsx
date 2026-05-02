import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  ready: boolean;
  supabaseEnabled: boolean;
  refreshClaims: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function adminFromUser(user: User | null): boolean {
  return user?.app_metadata?.admin === true;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(() => !isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setUser(null);
      setReady(true);
      return;
    }

    const supabase = getSupabaseClient();

    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshClaims = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return;
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return;
    }
    await getSupabaseClient().auth.signOut();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signUp({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAdmin: adminFromUser(user),
      ready,
      supabaseEnabled: isSupabaseConfigured(),
      refreshClaims,
      signInWithEmail,
      registerWithEmail,
      signOutUser,
    }),
    [user, session, ready, refreshClaims, signOutUser, signInWithEmail, registerWithEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
