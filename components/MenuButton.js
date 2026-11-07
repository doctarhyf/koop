import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { colors, radius, shadows, space, type } from "../theme";
import { PressableScale, Text } from "./ui";

// Card-style action row. `btn = { label, icon (image source), desc? }`, or pass an `icon` element.
const MenuButton = ({ handleOnPress, btn, icon, subtitle }) => {
  const desc = subtitle || btn.desc;
  return (
    <PressableScale onPress={() => handleOnPress(btn)} scaleTo={0.985} style={[st.card, shadows.xs]}>
      <View style={st.icon}>
        {icon ? (
          icon
        ) : btn.icon ? (
          <Image style={{ width: 26, height: 26 }} source={btn.icon} contentFit="contain" />
        ) : (
          <Feather name="circle" size={20} color={colors.primary} />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.title} numberOfLines={1}>
          {String(btn.label || "")
            .toLowerCase()
            .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
        </Text>
        {desc ? (
          <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={2}>
            {desc}
          </Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color={colors.textFaint} />
    </PressableScale>
  );
};

export default MenuButton;

const st = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    paddingRight: space.md,
    marginTop: space.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
