import { radii } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  source: ImageSourcePropType;
  fallback: ImageSourcePropType;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const PAGE_GUTTER = 40;

/** Fixed 4:3 frame so recipe photos crop instead of stretching behind the page. */
export function RecipePhoto({ source, fallback, accessibilityLabel, style }: Props) {
  const colors = useThemeColors();
  const [current, setCurrent] = useState(source);
  const [width, setWidth] = useState(() => Math.max(Dimensions.get("window").width - PAGE_GUTTER, 1));

  useEffect(() => {
    setCurrent(source);
  }, [source]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) {
      setWidth(next);
    }
  };

  const height = Math.round((width * 3) / 4);

  return (
    <View
      onLayout={onLayout}
      style={[styles.frame, { backgroundColor: colors.border, height }, style]}
    >
      <Image
        source={current}
        style={{ width, height }}
        resizeMode="cover"
        fadeDuration={0}
        accessibilityLabel={accessibilityLabel}
        onError={() => {
          if (current !== fallback) {
            setCurrent(fallback);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    borderRadius: radii.lg,
    overflow: "hidden",
  },
});
