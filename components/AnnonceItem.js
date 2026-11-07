import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, fonts, radius, shadows, space, type } from "../theme";
import { Badge, Text } from "./ui";

export default function AnnonceItem({ item, itsMyItem }) {
  const me = itsMyItem;
  const author = item?.user_data || {};
  const hasImage = item?.images && item.images.length > 0;
  const thumb = hasImage ? item.images[0] : author.profile;

  return (
    <View style={[st.card, shadows.xs]}>
      <View style={st.thumbWrap}>
        {thumb ? (
          <Image source={thumb} style={st.thumb} contentFit="cover" transition={250} />
        ) : (
          <View style={[st.thumb, st.thumbEmpty]}>
            <Feather name="image" size={20} color={colors.primary} />
          </View>
        )}
        {hasImage && item.images.length > 1 ? (
          <View style={st.count}>
            <Text style={st.countText}>+{item.images.length - 1}</Text>
          </View>
        ) : null}
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <View style={st.meta}>
          {author.ville ? <Badge label={author.ville} tone="primary" /> : null}
          {me ? <Badge label="Moi" tone="success" /> : null}
        </View>
        <Text numberOfLines={2} style={type.title}>
          {item?.label}
        </Text>
        <View style={st.footer}>
          <Text numberOfLines={1} style={[type.caption, { color: colors.textMuted, flexShrink: 1 }]}>
            {author.display_name}
          </Text>
          <View style={st.dot} />
          <Feather name="clock" size={11} color={colors.textFaint} />
          <Text style={[type.caption, { color: colors.textFaint }]}>{item?.timeAgo}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textFaint} style={{ alignSelf: "center" }} />
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.sm,
    marginBottom: space.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  thumbWrap: { width: 76, height: 76 },
  thumb: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.sky50 },
  thumbEmpty: { alignItems: "center", justifyContent: "center" },
  count: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "rgba(11,18,32,0.65)",
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countText: { color: "#fff", fontFamily: fonts.bold, fontSize: 10 },
  meta: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  footer: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textFaint },
});
