import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FontScaleKey } from "@/constants/theme";
import { fontScaleMultipliers } from "@/constants/theme";
import type { Lang } from "@/lib/i18n";

const VALID_LANGS: Lang[] = ["en", "ig", "fr"];

function normalizeLang(value: unknown): Lang {
  return VALID_LANGS.includes(value as Lang) ? (value as Lang) : "en";
}

const STORAGE_KEY = "@afrobiome/app-settings-v1";

export type AppSettings = {
  language: Lang;
  fontScale: FontScaleKey;
  highContrast: boolean;
  audioGuidance: boolean;
  onboardingComplete: boolean;
  guestMode: boolean;
  pin: string | null;
};

const defaultSettings: AppSettings = {
  language: "en",
  fontScale: "normal",
  highContrast: false,
  audioGuidance: false,
  onboardingComplete: false,
  guestMode: true,
  pin: null,
};

type AppSettingsContextValue = AppSettings & {
  hydrated: boolean;
  setLanguage: (l: Lang) => void;
  setFontScale: (f: FontScaleKey) => void;
  setHighContrast: (v: boolean) => void;
  setAudioGuidance: (v: boolean) => void;
  completeOnboarding: (opts?: { pin?: string | null; guest?: boolean }) => void;
  resetOnboarding: () => void;
  scale: number;
  triggerHaptic: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as Partial<AppSettings>;
          setSettings({
            ...defaultSettings,
            ...parsed,
            language: normalizeLang(parsed.language),
          });
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((updater: (prev: AppSettings) => AppSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setLanguage = useCallback((language: Lang) => {
    persist((prev) => ({ ...prev, language }));
  }, [persist]);

  const setFontScale = useCallback((fontScale: FontScaleKey) => {
    persist((prev) => ({ ...prev, fontScale }));
  }, [persist]);

  const setHighContrast = useCallback((highContrast: boolean) => {
    persist((prev) => ({ ...prev, highContrast }));
  }, [persist]);

  const setAudioGuidance = useCallback((audioGuidance: boolean) => {
    persist((prev) => ({ ...prev, audioGuidance }));
  }, [persist]);

  const completeOnboarding = useCallback(
    (opts?: { pin?: string | null; guest?: boolean }) => {
      persist((prev) => ({
        ...prev,
        onboardingComplete: true,
        guestMode: opts?.guest !== false,
        pin: opts?.pin !== undefined ? opts.pin : prev.pin,
      }));
    },
    [persist],
  );

  const resetOnboarding = useCallback(() => {
    persist((prev) => ({ ...prev, onboardingComplete: false }));
  }, [persist]);

  const triggerHaptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const scale = fontScaleMultipliers[settings.fontScale];

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      ...settings,
      hydrated,
      setLanguage,
      setFontScale,
      setHighContrast,
      setAudioGuidance,
      completeOnboarding,
      resetOnboarding,
      scale,
      triggerHaptic,
    }),
    [
      settings,
      hydrated,
      setLanguage,
      setFontScale,
      setHighContrast,
      setAudioGuidance,
      completeOnboarding,
      resetOnboarding,
      scale,
      triggerHaptic,
    ],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}
