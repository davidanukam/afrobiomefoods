import { PrimaryButton } from "@/components/PrimaryButton";
import { RecipePhoto } from "@/components/RecipePhoto";
import { ThemedText } from "@/components/ThemedText";
import { useAppSettings } from "@/context/AppSettingsContext";
import { getRecipeById, recipeCopy } from "@/data/recipes";
import { recipeFinalImage } from "@/data/recipeFinalImages";
import { recipeIngredientImage } from "@/data/recipeIngredientImages";
import { useRemoteRecipes } from "@/hooks/useRemoteRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { t, type Lang } from "@/lib/i18n";
import { speechLang } from "@/lib/locale";
import { HeaderBackButton } from "@react-navigation/elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Stack, router, useLocalSearchParams, type Href } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback, useMemo } from "react";
import { Alert, BackHandler, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailScreen() {
    const { id: rawId, from: rawFrom } = useLocalSearchParams<{
        id: string | string[];
        from?: string | string[];
    }>();
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const openedFromHome = (Array.isArray(rawFrom) ? rawFrom[0] : rawFrom) === "home";
    const navigation = useNavigation();
    const colors = useThemeColors();
    const { language, scale, highContrast } = useAppSettings();
    const { getById } = useRemoteRecipes();
    const recipe = id ? getById(id) ?? getRecipeById(id) : undefined;

    const copy = useMemo(
        () => (recipe ? recipeCopy(recipe, language) : null),
        [recipe, language],
    );

    const goBack = useCallback(() => {
        if (openedFromHome) {
            router.navigate("/home" as Href);
            navigation.reset({
                index: 0,
                routes: [{ name: "index" }],
            });
            return;
        }
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.replace("/recipes" as Href);
        }
    }, [navigation, openedFromHome]);

    useFocusEffect(
        useCallback(() => {
            const onHardwareBack = () => {
                if (openedFromHome) {
                    goBack();
                    return true;
                }
                return false;
            };
            const sub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
            return () => {
                sub.remove();
                Speech.stop();
            };
        }, [goBack, openedFromHome]),
    );

    if (!recipe || !copy) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]}>
                <ThemedText variant="body">{t(language, "recipeNotFound")}</ThemedText>
            </SafeAreaView>
        );
    }

    const { name: title, ingredients, instructions, cultural } = copy;
    const ingredientPhoto = recipeIngredientImage(recipe.recipe_id);
    const finishedPhoto = recipeFinalImage(recipe.recipe_id);

    const speak = (text: string, lang: Lang) => {
        Speech.stop();
        Speech.speak(text, { language: speechLang(lang), rate: 0.95 });
    };

    const readAll = (readLang: Lang) => {
        const c = recipeCopy(recipe, readLang);
        const body = [
            ...c.ingredients,
            "",
            ...c.instructions.map((s, idx) => `Step ${idx + 1}. ${s}`),
        ].join(". ");
        speak(body, readLang);
    };

    const onShare = async () => {
        try {
            await Share.share({
                title,
                message: `${title}\n\n${ingredients.map((i) => `• ${i}`).join("\n")}`,
            });
        } catch {
            /* ignore */
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.cream }]} edges={["bottom", "left", "right"]}>
            <Stack.Screen
                options={{
                    title: "",
                    headerBackTitle: t(language, "recipes"),
                    headerLeft: () => (
                        <HeaderBackButton
                            onPress={goBack}
                            accessibilityLabel={t(language, "back")}
                        />
                    ),
                }}
            />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <ThemedText variant="title" style={{ marginBottom: 12 }}>
                    {title}
                </ThemedText>
                <RecipePhoto
                    source={ingredientPhoto}
                    fallback={finishedPhoto}
                    accessibilityLabel={`${title}, ${t(language, "ingredientPhoto")}`}
                    style={{ marginBottom: 16 }}
                />

                <ThemedText variant="caption" color="muted" style={{ marginBottom: 8 }}>
                    {t(language, "listen")}
                </ThemedText>
                <View style={styles.row}>
                    <Pressable
                        style={[styles.audioBtn, { backgroundColor: highContrast ? colors.forest : colors.gold }]}
                        onPress={() => readAll("en")}
                        accessibilityRole="button"
                        accessibilityLabel={`${t(language, "listen")} ${t(language, "listenEn")}`}
                    >
                        <ThemedText
                            variant="label"
                            style={{ color: highContrast ? colors.inverse : colors.forest, textAlign: "center" }}
                            numberOfLines={1}
                        >
                            {t(language, "listenEn")}
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.audioBtn, { backgroundColor: colors.forestLight }]}
                        onPress={() => readAll("ig")}
                        accessibilityRole="button"
                        accessibilityLabel={`${t(language, "listen")} ${t(language, "listenIg")}`}
                    >
                        <ThemedText variant="label" color="inverse" style={{ textAlign: "center" }} numberOfLines={1}>
                            {t(language, "listenIg")}
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.audioBtn, { backgroundColor: highContrast ? colors.forest : "#8C4A32" }]}
                        onPress={() => readAll("fr")}
                        accessibilityRole="button"
                        accessibilityLabel={`${t(language, "listen")} ${t(language, "listenFr")}`}
                    >
                        <ThemedText variant="label" color="inverse" style={{ textAlign: "center" }} numberOfLines={1}>
                            {t(language, "listenFr")}
                        </ThemedText>
                    </Pressable>
                </View>

                <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
                    {t(language, "ingredients")}
                </ThemedText>
                {ingredients.map((line) => (
                    <ThemedText key={line} variant="body" style={{ marginTop: 6 }}>
                        • {line}
                    </ThemedText>
                ))}

                <RecipePhoto
                    source={finishedPhoto}
                    fallback={ingredientPhoto}
                    accessibilityLabel={`${title}, ${t(language, "finishedDishPhoto")}`}
                    style={{ marginTop: 16 }}
                />

                <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
                    {t(language, "instructions")}
                </ThemedText>
                {instructions.map((line, idx) => (
                    <ThemedText key={idx} variant="body" style={{ marginTop: 8 }}>
                        {idx + 1}. {line}
                    </ThemedText>
                ))}

                <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
                    {t(language, "culturalNotes")}
                </ThemedText>
                <ThemedText variant="body" style={{ marginTop: 6 }}>
                    {cultural}
                </ThemedText>

                <ThemedText variant="subtitle" style={{ marginTop: 16 }}>
                    {t(language, "healthBenefits")}
                </ThemedText>
                <ThemedText variant="caption" color="muted" style={{ marginTop: 6 }}>
                    kcal: {recipe.nutrition.calories} · Protein: {recipe.nutrition.protein}g · Fiber:{" "}
                    {recipe.nutrition.fiber}g
                </ThemedText>
                {recipe.health_tags.map((tag) => (
                    <ThemedText key={tag} variant="body" style={{ marginTop: 4 }}>
                        • {tag}
                    </ThemedText>
                ))}

                <View style={styles.actions}>
                    <PrimaryButton
                        title={t(language, "startCookingMode")}
                        onPress={() => router.push(`/recipes/cooking/${recipe.recipe_id}` as Href)}
                    />
                    <View style={styles.row}>
                        <Pressable
                            style={[styles.secondary, { borderColor: colors.forest }]}
                            onPress={() => Alert.alert(t(language, "save"), t(language, "savedRecipesPhase2"))}
                        >
                            <ThemedText variant="label" color="accent">
                                {t(language, "save")}
                            </ThemedText>
                        </Pressable>
                        <Pressable style={[styles.secondary, { borderColor: colors.forest }]} onPress={onShare}>
                            <ThemedText variant="label" color="accent">
                                {t(language, "share")}
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>

                <ThemedText variant="caption" color="muted" style={{ marginTop: 8, marginBottom: 24, fontSize: 14 * scale }}>
                    {t(language, "demoAudio")}
                </ThemedText>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { padding: 20, paddingBottom: 36 },
    row: { flexDirection: "row", gap: 8 },
    audioBtn: {
        flex: 1,
        minHeight: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    actions: { marginTop: 24, gap: 12 },
    secondary: {
        flex: 1,
        minHeight: 48,
        borderRadius: 999,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
});
