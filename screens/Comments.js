import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, EmptyState, FadeIn, ListSkeleton, Text } from "../components/ui";
import { useFetch2 } from "../hooks/useFetch";
import { colors, radius, shadows, space, type } from "../theme";

export default function Comments({ route, navigation }) {
  const { item_id, item_type, comments_count } = route.params;
  const apiPath = `https://konext.vercel.app/api/comments?item_id=${item_id}&item_type=${item_type}`;
  const [loading, comments, error, reload] = useFetch2(apiPath);

  useLayoutEffect(() => {
    let comlen = 0;

    if (comments) comlen = comments.length;

    navigation.setOptions({
      title: `Avis (${comments_count || comlen})`,
      headerRight: () => (
        <ActivityIndicator animating={loading} color={colors.primary} />
      ),
    });
  }, [route, loading, comments]);

  const keyExtractor = (item, i) => String(item?.id ?? i);

  const renderItem = ({ item, index }) => (
    <FadeIn delay={Math.min(index, 8) * 40}>
      <View style={[st.card, shadows.xs]}>
        <Avatar uri={item.user_data?.profile} name={item.user_data?.display_name} size={40} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={[type.bodyStrong, { flexShrink: 1 }]} numberOfLines={1}>
              {item.user_data?.display_name}
            </Text>
            <Text style={[type.caption, { color: colors.textFaint }]}>· {item.timeAgo}</Text>
          </View>
          <Text style={[type.body, { color: colors.textSecondary }]}>{item.comment}</Text>
        </View>
      </View>
    </FadeIn>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {loading && (!comments || comments.length === 0) ? (
        <View style={{ padding: space.lg }}>
          <ListSkeleton rows={4} />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => reload()} tintColor={colors.primary} />
          }
          contentContainerStyle={[
            { padding: space.lg, gap: space.sm, paddingBottom: space.xxxl },
            (!comments || comments.length === 0) && { flex: 1, justifyContent: "center" },
          ]}
          data={comments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <EmptyState icon="message-square" title="Pas encore d'avis" subtitle="Soyez le premier à laisser un commentaire." />
          }
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
});
