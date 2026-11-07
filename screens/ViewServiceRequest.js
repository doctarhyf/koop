import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useLayoutEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentBox from "../components/CommentBox";
import {
  Avatar,
  Badge,
  Button,
  Card,
  FadeIn,
  IconButton,
  PressableScale,
  Text,
  haptic,
} from "../components/ui";
import UserContext from "../context/UserContext";
import * as API from "../utils/api";
import { colors, fonts, gradients, radius, shadows, space, type } from "../theme";

const ACTION = {
  SEND_MESSAGE: "send_message",
  INTERESTED: "interested",
  CALL_NOW: "call_now",
  VIEW_SHOP: "view_shop",
};

export default function ViewServiceRequest({ navigation, route }) {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const serviceRequest = route.params;
  const postedBy = serviceRequest.user_data || {};
  let me = serviceRequest.user_id === user.id;
  if (serviceRequest.other) me = false;
  const [loading, setloading] = useState(false);
  const [interested, setInterested] = useState(false);

  const images = Array.isArray(serviceRequest.images) ? serviceRequest.images : [];
  const links = serviceRequest.links ? serviceRequest.links.split(";").filter(Boolean) : [];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Détails",
      headerRight: () => (
        <IconButton
          name="plus"
          size={36}
          bg={colors.ink}
          color="#fff"
          border={false}
          onPress={() => navigation.navigate("ServiceRequest", undefined, { pop: true })}
        />
      ),
    });
  }, [navigation]);

  const onAction = (action) => {
    switch (action) {
      case ACTION.SEND_MESSAGE:
        navigation.navigate(
          "SendMessage",
          {
            shop_name: postedBy.shop_name,
            shop_id: serviceRequest.user_id,
            from_id: user.id,
            to_id: postedBy.id,
            name: serviceRequest.label,
          },
          { pop: true }
        );
        break;
      case ACTION.INTERESTED:
        haptic("success");
        setInterested((v) => !v);
        break;
      case ACTION.CALL_NOW:
        Linking.openURL(`tel:${postedBy.phone}`);
        break;
      case ACTION.VIEW_SHOP:
        navigation.navigate("Shop", postedBy, { pop: true });
        break;
    }
  };

  const openComments = () =>
    navigation.navigate(
      "Comments",
      {
        item_id: serviceRequest.id,
        item_type: "sreq",
        comments_count: serviceRequest.comments_count,
      },
      { pop: true }
    );

  const onDelete = (item) => {
    Alert.alert("Supprimer l'annonce ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setloading(true);
          const res = await API.removeServReq(item.id);
          setloading(false);
          if (res.error) {
            Alert.alert("Erreur de suppression", res.message);
          } else {
            haptic("success");
            Alert.alert("Annonce supprimée", "Votre annonce a bien été supprimée.", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          }
        },
      },
    ]);
  };

  const STATS = [
    { icon: "eye", label: "Vues", value: serviceRequest.views_count ?? 0 },
    { icon: "bookmark", label: "Intéressés", value: (serviceRequest.likes_count ?? 0) + (interested ? 1 : 0) },
    { icon: "message-square", label: "Avis", value: serviceRequest.comments_count ?? 0, onPress: openComments },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: (me ? space.xl : 120) + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Media */}
        <FadeIn>
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled={false}
              snapToInterval={300 + space.sm}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: space.sm }}
              style={{ marginHorizontal: -space.lg }}
            >
              <View style={{ width: space.lg - space.sm }} />
              {images.map((img, i) => (
                <PressableScale key={i} onPress={() => navigation.navigate("PhotoViewer", img, { pop: true })}>
                  <Image source={img} style={st.media} contentFit="cover" transition={300} />
                </PressableScale>
              ))}
              <View style={{ width: space.lg - space.sm }} />
            </ScrollView>
          ) : (
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.placeholder}>
              <Feather name="zap" size={32} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          )}
        </FadeIn>

        {/* Title */}
        <FadeIn delay={60} style={{ gap: space.xs }}>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {postedBy.ville ? <Badge label={postedBy.ville} /> : null}
            <Badge label={serviceRequest.timeAgo || "Récent"} tone="violet" />
            {me ? <Badge label="Votre annonce" tone="success" /> : null}
          </View>
          <Text style={type.h1}>{serviceRequest.label}</Text>
          {serviceRequest.desc ? (
            <Text style={[type.body, { color: colors.textSecondary }]}>{serviceRequest.desc}</Text>
          ) : null}
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={120} style={st.stats}>
          {STATS.map((s) => (
            <PressableScale
              key={s.label}
              onPress={s.onPress}
              disabled={!s.onPress}
              style={[st.stat, shadows.xs]}
            >
              <Feather name={s.icon} size={16} color={colors.primary} />
              <Text style={st.statValue}>{s.value}</Text>
              <Text style={[type.caption, { color: colors.textMuted }]}>{s.label}</Text>
            </PressableScale>
          ))}
        </FadeIn>

        {/* Author */}
        <FadeIn delay={160}>
          <Card style={st.author}>
            <PressableScale onPress={() => navigation.navigate("PhotoViewer", postedBy.profile, { pop: true })}>
              <Avatar uri={postedBy.profile} name={postedBy.display_name} size={52} ring />
            </PressableScale>
            <View style={{ flex: 1 }}>
              <Text style={type.title} numberOfLines={1}>
                {me ? "Vous" : postedBy.display_name}
              </Text>
              <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={1}>
                {postedBy.shop_name || "Boutique KOOP"}
              </Text>
            </View>
            {!me && (
              <Button
                title="Boutique"
                variant="secondary"
                size="sm"
                full={false}
                onPress={() => onAction(ACTION.VIEW_SHOP)}
              />
            )}
          </Card>
        </FadeIn>

        {/* Links */}
        {links.length > 0 && (
          <FadeIn delay={200}>
            <Text style={[type.overline, { color: colors.textMuted, marginBottom: space.xs }]}>Liens</Text>
            <Card padded={false} style={{ paddingHorizontal: space.md }}>
              {links.map((lk, i) => (
                <PressableScale
                  key={i}
                  onPress={() => Linking.openURL(lk)}
                  style={[st.link, i < links.length - 1 && st.linkDivider]}
                >
                  <Feather name="link-2" size={16} color={colors.primary} />
                  <Text numberOfLines={1} style={[type.small, { flex: 1, color: colors.primary }]}>{lk}</Text>
                  <Feather name="external-link" size={14} color={colors.textFaint} />
                </PressableScale>
              ))}
            </Card>
          </FadeIn>
        )}

        {/* Comment */}
        {!me && (
          <FadeIn delay={240}>
            <Text style={[type.overline, { color: colors.textMuted, marginBottom: space.xs }]}>
              Laisser un avis
            </Text>
            <CommentBox
              navigation={navigation}
              item_id={serviceRequest.id}
              posted_by_id={user.id}
              item_type="sreq"
            />
          </FadeIn>
        )}

        {me && (
          <Button
            title="Supprimer l'annonce"
            icon="trash-2"
            variant="danger"
            loading={loading}
            onPress={() => onDelete(serviceRequest)}
          />
        )}
      </ScrollView>

      {/* Sticky action bar */}
      {!me && (
        <View style={[st.bar, shadows.lg, { paddingBottom: insets.bottom + space.sm }]}>
          <IconButton
            name="bookmark"
            size={52}
            bg={interested ? colors.ink : colors.card}
            color={interested ? "#fff" : colors.text}
            onPress={() => onAction(ACTION.INTERESTED)}
          />
          <IconButton name="phone" size={52} onPress={() => onAction(ACTION.CALL_NOW)} />
          <Button
            title="Envoyer un message"
            icon="send"
            style={{ flex: 1 }}
            onPress={() => onAction(ACTION.SEND_MESSAGE)}
          />
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  media: { width: 300, height: 220, borderRadius: radius.lg, backgroundColor: colors.sky100 },
  placeholder: {
    height: 160,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: { flexDirection: "row", gap: space.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space.sm,
    gap: 2,
  },
  statValue: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.text, marginTop: 4 },
  author: { flexDirection: "row", alignItems: "center", gap: space.sm },
  link: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: 14 },
  linkDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
