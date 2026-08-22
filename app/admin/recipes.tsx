import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

type RecipeRow = {
  id: string;
  source_id: string | null;
  doc: Record<string, unknown> | null;
};

type RecipeDifficulty = "easy" | "medium";
type RecipeCategory = "soups" | "swallows" | "vegetables" | "soft";

const categories: RecipeCategory[] = ["soups", "swallows", "vegetables", "soft"];
const difficulties: RecipeDifficulty[] = ["easy", "medium"];

type RecipeForm = {
  sourceId: string;
  category: RecipeCategory;
  nameEn: string;
  nameIg: string;
  cookMinutes: string;
  difficulty: RecipeDifficulty;
  calories: string;
  protein: string;
  fiber: string;
  healthTagsText: string;
  ingredientsEnText: string;
  ingredientsIgText: string;
  instructionsEnText: string;
  instructionsIgText: string;
  notesEn: string;
  notesIg: string;
  imageHint: string;
  audioEn: string;
  audioIg: string;
};

const emptyForm: RecipeForm = {
  sourceId: "",
  category: "soups",
  nameEn: "",
  nameIg: "",
  cookMinutes: "30",
  difficulty: "easy",
  calories: "0",
  protein: "0",
  fiber: "0",
  healthTagsText: "",
  ingredientsEnText: "",
  ingredientsIgText: "",
  instructionsEnText: "",
  instructionsIgText: "",
  notesEn: "",
  notesIg: "",
  imageHint: "recipe",
  audioEn: "",
  audioIg: "",
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumberString(v: unknown, fallback: string): string {
  return typeof v === "number" && Number.isFinite(v) ? String(v) : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function arrayToLines(v: unknown): string {
  return asStringArray(v).join("\n");
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function rowToForm(row: RecipeRow): RecipeForm {
  const doc = row.doc ?? {};
  const nutrition = (doc.nutrition as { calories?: number; protein?: number; fiber?: number } | undefined) ?? {};
  const category = asString(doc.category) as RecipeCategory;
  const difficulty = asString(doc.difficulty) as RecipeDifficulty;
  return {
    sourceId: row.source_id ?? "",
    category: categories.includes(category) ? category : "soups",
    nameEn: asString(doc.name_en),
    nameIg: asString(doc.name_ig),
    cookMinutes: asNumberString(doc.cook_minutes, "30"),
    difficulty: difficulties.includes(difficulty) ? difficulty : "easy",
    calories: asNumberString(nutrition.calories, "0"),
    protein: asNumberString(nutrition.protein, "0"),
    fiber: asNumberString(nutrition.fiber, "0"),
    healthTagsText: arrayToLines(doc.health_tags),
    ingredientsEnText: arrayToLines(doc.ingredients_en),
    ingredientsIgText: arrayToLines(doc.ingredients_ig),
    instructionsEnText: arrayToLines(doc.instructions_en),
    instructionsIgText: arrayToLines(doc.instructions_ig),
    notesEn: asString(doc.cultural_notes_en),
    notesIg: asString(doc.cultural_notes_ig),
    imageHint: asString(doc.image_hint, "recipe"),
    audioEn: asString(doc.audio_en),
    audioIg: asString(doc.audio_ig),
  };
}

function formToDoc(form: RecipeForm): Record<string, unknown> {
  return {
    category: form.category,
    name_en: form.nameEn.trim(),
    name_ig: form.nameIg.trim(),
    ingredients_en: linesToArray(form.ingredientsEnText),
    ingredients_ig: linesToArray(form.ingredientsIgText),
    instructions_en: linesToArray(form.instructionsEnText),
    instructions_ig: linesToArray(form.instructionsIgText),
    cultural_notes_en: form.notesEn.trim(),
    cultural_notes_ig: form.notesIg.trim(),
    cook_minutes: Number(form.cookMinutes) || 0,
    difficulty: form.difficulty,
    nutrition: {
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      fiber: Number(form.fiber) || 0,
    },
    health_tags: linesToArray(form.healthTagsText),
    image_hint: form.imageHint.trim() || "recipe",
    ...(form.audioEn.trim() ? { audio_en: form.audioEn.trim() } : {}),
    ...(form.audioIg.trim() ? { audio_ig: form.audioIg.trim() } : {}),
  };
}

export default function AdminRecipesScreen() {
  const colors = useThemeColors();
  const { isAdmin, supabaseEnabled } = useAuth();
  const [rows, setRows] = useState<RecipeRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<RecipeForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => rows.find((r) => r.id === selectedId) ?? null, [rows, selectedId]);

  const loadRecipes = useCallback(async () => {
    if (!supabaseEnabled || !isSupabaseConfigured() || !isAdmin) {
      return;
    }
    setLoading(true);
    const { data, error } = await getSupabaseClient()
      .from("recipes")
      .select("id, source_id, doc")
      .order("source_id", { ascending: true, nullsFirst: false });
    setLoading(false);
    if (error) {
      Alert.alert("Load failed", error.message);
      return;
    }
    setRows((data as RecipeRow[]) ?? []);
  }, [isAdmin, supabaseEnabled]);

  useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  const startNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
  };

  const loadIntoEditor = (row: RecipeRow) => {
    setSelectedId(row.id);
    setForm(rowToForm(row));
  };

  const save = async () => {
    if (!isAdmin) {
      Alert.alert("Admin only", "You need an admin claim to edit recipes.");
      return;
    }
    const sid = form.sourceId.trim();
    if (!sid) {
      Alert.alert("Missing source_id", "Add a stable source_id (e.g. ofe-oha).");
      return;
    }
    const parsed = formToDoc(form);
    if (!asString(parsed.name_en).trim()) {
      Alert.alert("Missing name_en", "Please add an English recipe name.");
      return;
    }

    setLoading(true);
    const existing = rows.find((r) => r.source_id === sid);
    const supabase = getSupabaseClient();
    const result = existing
      ? await supabase.from("recipes").update({ source_id: sid, doc: parsed }).eq("id", existing.id)
      : await supabase.from("recipes").insert({ source_id: sid, doc: parsed });
    setLoading(false);

    if (result.error) {
      Alert.alert("Save failed", result.error.message);
      return;
    }
    Alert.alert("Saved", "Recipe saved to Supabase.");
    await loadRecipes();
    if (existing) {
      setSelectedId(existing.id);
    }
  };

  const removeSelected = async () => {
    if (!selected) {
      Alert.alert("Nothing selected", "Select a recipe first.");
      return;
    }
    Alert.alert("Delete recipe?", `This will permanently delete "${selected.source_id ?? selected.id}".`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void (async () => {
            setLoading(true);
            const { error } = await getSupabaseClient().from("recipes").delete().eq("id", selected.id);
            setLoading(false);
            if (error) {
              Alert.alert("Delete failed", error.message);
              return;
            }
            Alert.alert("Deleted", "Recipe removed.");
            setSelectedId(null);
            setForm(emptyForm);
            await loadRecipes();
          })();
        },
      },
    ]);
  };

  if (!supabaseEnabled || !isSupabaseConfigured()) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
        <Stack.Screen options={{ title: "Admin Recipes" }} />
        <View style={styles.pad}>
          <ThemedText variant="body">Supabase is not configured.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
        <Stack.Screen options={{ title: "Admin Recipes" }} />
        <View style={styles.pad}>
          <ThemedText variant="body">Admin access required.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: "Admin Recipes" }} />
      <ScrollView contentContainerStyle={styles.pad}>
        <View style={styles.row}>
          <PrimaryButton title="New recipe" variant="outline" onPress={startNew} />
          <PrimaryButton title={loading ? "Refreshing..." : "Refresh"} variant="outline" onPress={() => void loadRecipes()} disabled={loading} />
          <PrimaryButton title="Delete" variant="outline" onPress={() => void removeSelected()} disabled={loading || !selected} />
        </View>

        <ThemedText variant="subtitle">Recipes</ThemedText>
        <View style={styles.list}>
          {rows.map((r) => {
            const active = r.id === selectedId;
            return (
              <Pressable
                key={r.id}
                onPress={() => loadIntoEditor(r)}
                style={[
                  styles.item,
                  {
                    backgroundColor: active ? colors.gold + "44" : colors.card,
                    borderColor: active ? colors.forest : colors.border,
                  },
                ]}
              >
                <ThemedText variant="caption">{r.source_id || r.id}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ThemedText variant="caption" color="muted">
          source_id
        </ThemedText>
        <TextInput
          value={form.sourceId}
          onChangeText={(v) => setForm((f) => ({ ...f, sourceId: v }))}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="ofe-oha"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
        />

        <ThemedText variant="caption" color="muted">Category</ThemedText>
        <View style={styles.pills}>
          {categories.map((c) => {
            const active = form.category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setForm((f) => ({ ...f, category: c }))}
                style={[styles.pill, { borderColor: active ? colors.forest : colors.border, backgroundColor: active ? colors.gold + "44" : colors.card }]}
              >
                <ThemedText variant="caption">{c}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ThemedText variant="caption" color="muted">name_en</ThemedText>
        <TextInput value={form.nameEn} onChangeText={(v) => setForm((f) => ({ ...f, nameEn: v }))} placeholder="Oha Soup" placeholderTextColor={colors.textMuted} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">name_ig</ThemedText>
        <TextInput value={form.nameIg} onChangeText={(v) => setForm((f) => ({ ...f, nameIg: v }))} placeholder="Ofe Oha" placeholderTextColor={colors.textMuted} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <View style={styles.row}>
          <View style={styles.col}>
            <ThemedText variant="caption" color="muted">cook_minutes</ThemedText>
            <TextInput value={form.cookMinutes} onChangeText={(v) => setForm((f) => ({ ...f, cookMinutes: v }))} keyboardType="number-pad" style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
          </View>
          <View style={styles.col}>
            <ThemedText variant="caption" color="muted">difficulty</ThemedText>
            <View style={styles.pills}>
              {difficulties.map((d) => {
                const active = form.difficulty === d;
                return (
                  <Pressable key={d} onPress={() => setForm((f) => ({ ...f, difficulty: d }))} style={[styles.pill, { borderColor: active ? colors.forest : colors.border, backgroundColor: active ? colors.gold + "44" : colors.card }]}>
                    <ThemedText variant="caption">{d}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <ThemedText variant="caption" color="muted">calories</ThemedText>
            <TextInput value={form.calories} onChangeText={(v) => setForm((f) => ({ ...f, calories: v }))} keyboardType="number-pad" style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
          </View>
          <View style={styles.col}>
            <ThemedText variant="caption" color="muted">protein</ThemedText>
            <TextInput value={form.protein} onChangeText={(v) => setForm((f) => ({ ...f, protein: v }))} keyboardType="number-pad" style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
          </View>
          <View style={styles.col}>
            <ThemedText variant="caption" color="muted">fiber</ThemedText>
            <TextInput value={form.fiber} onChangeText={(v) => setForm((f) => ({ ...f, fiber: v }))} keyboardType="number-pad" style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
          </View>
        </View>

        <ThemedText variant="caption" color="muted">ingredients_en (one per line)</ThemedText>
        <TextInput value={form.ingredientsEnText} onChangeText={(v) => setForm((f) => ({ ...f, ingredientsEnText: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">ingredients_ig (one per line)</ThemedText>
        <TextInput value={form.ingredientsIgText} onChangeText={(v) => setForm((f) => ({ ...f, ingredientsIgText: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <ThemedText variant="caption" color="muted">instructions_en (one per line)</ThemedText>
        <TextInput value={form.instructionsEnText} onChangeText={(v) => setForm((f) => ({ ...f, instructionsEnText: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">instructions_ig (one per line)</ThemedText>
        <TextInput value={form.instructionsIgText} onChangeText={(v) => setForm((f) => ({ ...f, instructionsIgText: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <ThemedText variant="caption" color="muted">cultural_notes_en</ThemedText>
        <TextInput value={form.notesEn} onChangeText={(v) => setForm((f) => ({ ...f, notesEn: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">cultural_notes_ig</ThemedText>
        <TextInput value={form.notesIg} onChangeText={(v) => setForm((f) => ({ ...f, notesIg: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <ThemedText variant="caption" color="muted">health_tags (one per line)</ThemedText>
        <TextInput value={form.healthTagsText} onChangeText={(v) => setForm((f) => ({ ...f, healthTagsText: v }))} multiline textAlignVertical="top" style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <ThemedText variant="caption" color="muted">image_hint</ThemedText>
        <TextInput value={form.imageHint} onChangeText={(v) => setForm((f) => ({ ...f, imageHint: v }))} autoCapitalize="none" autoCorrect={false} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">audio_en (optional URL)</ThemedText>
        <TextInput value={form.audioEn} onChangeText={(v) => setForm((f) => ({ ...f, audioEn: v }))} autoCapitalize="none" autoCorrect={false} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />
        <ThemedText variant="caption" color="muted">audio_ig (optional URL)</ThemedText>
        <TextInput value={form.audioIg} onChangeText={(v) => setForm((f) => ({ ...f, audioIg: v }))} autoCapitalize="none" autoCorrect={false} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]} />

        <PrimaryButton title={loading ? "Saving..." : "Save to Supabase"} onPress={() => void save()} disabled={loading} />
        {selected ? (
          <ThemedText variant="caption" color="muted">
            Editing row: {selected.id}
          </ThemedText>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pad: { padding: 16, gap: 10 },
  row: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  col: { flex: 1, gap: 6 },
  list: { gap: 8 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, minHeight: 34, justifyContent: "center" },
  item: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, minHeight: 42, justifyContent: "center" },
  input: { borderWidth: 1, borderRadius: 16, minHeight: 44, paddingHorizontal: 12, fontSize: 16 },
  textArea: { borderWidth: 1, borderRadius: 16, minHeight: 100, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
});
