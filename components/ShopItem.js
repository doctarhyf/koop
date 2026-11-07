import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, fonts, gradients, radius, shadows, space, type } from "../theme";
import { Avatar, PressableScale, Text } from "./ui";

export default function ShopItem({ navigation, shop, favedShops, onFaveShop }) {
  const isFaved = favedShops && favedShops.includes(shop.id);

  return (
    <PressableScale
      onPress={() => navigation.navigate("Shop", shop, { pop: true })}
      scaleTo={0.985}
      style={[st.card, shadows.sm]}
    >
      <View style={st.cover}>
        {shop.shop_profile ? (
          <Image source={shop.shop_profile} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        ) : (
          <LinearGradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient colors={gradients.scrim} style={StyleSheet.absoluteFill} />
        <PressableScale
          onPress={() => onFaveShop && onFaveShop(shop.id)}
          hapticKind="medium"
          scaleTo={0.85}
          style={[st.fave, isFaved && { backgroundColor: colors.danger }]}
        >
          <Feather name="heart" size={16} color="#fff" />
        </PressableScale>
      </View>

      <View style={st.body}>
        <Avatar uri={shop.profile} name={shop.display_name} size={52} style={st.avatar} ring />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.h3} numberOfLines={1}>{shop.shop_name}</Text>
          <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={1}>
            @{shop.display_name}
          </Text>
        </View>
        <View style={st.stats}>
          <View style={st.stat}>
            <Feather name="zap" size={13} color={colors.primary} />
            <Text style={st.statText}>{shop.items_count ?? 0}</Text>
          </View>
          <View style={st.stat}>
            <Feather name="message-square" size={13} color={colors.violet} />
            <Text style={st.statText}>{shop.comments_count ?? 0}</Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

const st = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: space.md,
    overflow: "hidden",
  },
  cover: { height: 120, backgroundColor: colors.sky100 },
  fave: {
    position: "absolute",
    top: space.sm,
    right: space.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(11,18,32,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    paddingTop: space.sm,
  },
  avatar: { marginTop: -34 },
  stats: { flexDirection: "row", gap: space.xs },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statText: { fontFamily: fonts.bold, fontSize: 12, color: colors.text },
});
