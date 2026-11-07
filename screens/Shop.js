import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useLayoutEffect } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import CommentBox from "../components/CommentBox";
import {
  Avatar,
  Button,
  Card,
  FadeIn,
  Group,
  ListRow,
  PressableScale,
  Text,
} from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, gradients, radius, space, type } from "../theme";

const SocialIcon = ({ src }) => (
  <View style={st.social}>
    <Image source={src} style={{ width: 20, height: 20 }} contentFit="contain" />
  </View>
);

export default function Shop({ route, navigation }) {
  const { user } = useContext(UserContext);
  const shop = route.params || {};
  const {
    profile,
    display_name,
    phone,
    shop_profile,
    shop_name,
    shop_desc,
    shop_add,
    shop_email,
    shop_whatsapp,
    shop_wechat,
    shop_tiktok,
    shop_facebook,
    shop_id,
  } = shop;

  const CONTACTS = [
    { id: shop_email, label: "Email", icon: require("../assets/icons/mail.png"), url: shop_email && `mailto:${shop_email}` },
    { id: shop_whatsapp, label: "WhatsApp", icon: require("../assets/icons/whatsapp.png"), url: shop_whatsapp && `https://wa.me/${String(shop_whatsapp).replace(/\D/g, "")}` },
    { id: shop_wechat, label: "WeChat", icon: require("../assets/icons/wechat.png") },
    { id: shop_tiktok, label: "TikTok", icon: require("../assets/icons/tiktok.png") },
    { id: shop_facebook, label: "Facebook", icon: require("../assets/icons/facebook.png") },
  ].filter((c) => c.id);

  useLayoutEffect(() => {
    navigation.setOptions({ title: shop_name || "Boutique" });
  }, [navigation]);

  const showAnnonces = () => navigation.navigate("MyItems", shop.id, { pop: true });
  const showCommentaires = () =>
    navigation.navigate("Comments", { item_id: shop_id, item_type: "shop" }, { pop: true });
  const sendMessage = () =>
    navigation.navigate(
      "SendMessage",
      { ...shop, from_id: user.id, to_id: shop_id, shop_name },
      { pop: true }
    );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: space.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={st.cover}>
        {shop_profile ? (
          <Image source={shop_profile} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        ) : (
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient colors={["rgba(11,18,32,0)", "rgba(11,18,32,0.25)"]} style={StyleSheet.absoluteFill} />
      </View>

      <FadeIn style={st.identity}>
        <PressableScale onPress={() => profile && navigation.navigate("PhotoViewer", profile, { pop: true })}>
          <Avatar uri={profile} name={display_name} size={88} style={st.avatar} />
        </PressableScale>
        <Text style={[type.h1, { textAlign: "center" }]}>{shop_name}</Text>
        <Text style={[type.body, { color: colors.textMuted }]}>@{display_name}</Text>

        <View style={st.actions}>
          <Button title="Message" icon="send" onPress={sendMessage} style={{ flex: 1 }} />
          {phone ? (
            <Button
              title="Appeler"
              icon="phone"
              variant="light"
              full={false}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            />
          ) : null}
        </View>
      </FadeIn>

      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        {shop_desc ? (
          <FadeIn delay={60}>
            <Card style={{ gap: 6 }}>
              <Text style={[type.overline, { color: colors.textMuted }]}>À propos</Text>
              <Text style={[type.body, { color: colors.textSecondary }]}>{shop_desc}</Text>
              {shop_add ? (
                <View style={st.address}>
                  <Feather name="map-pin" size={14} color={colors.primary} />
                  <Text style={[type.small, { color: colors.text, flex: 1 }]}>{shop_add}</Text>
                </View>
              ) : null}
            </Card>
          </FadeIn>
        ) : null}

        <FadeIn delay={100}>
          <Group title="Explorer">
            <ListRow icon="zap" title="Toutes les annonces" subtitle="Produits et services publiés" onPress={showAnnonces} />
            <ListRow
              icon="message-square"
              iconColor={colors.violet}
              iconBg={colors.violetSoft}
              title="Tous les avis"
              subtitle="Ce que disent les clients"
              onPress={showCommentaires}
              last
            />
          </Group>
        </FadeIn>

        {CONTACTS.length > 0 && (
          <FadeIn delay={140}>
            <Group title="Contacts">
              {CONTACTS.map((c, i) => (
                <ListRow
                  key={c.label}
                  leading={<SocialIcon src={c.icon} />}
                  title={c.id}
                  subtitle={c.label}
                  onPress={c.url ? () => Linking.openURL(c.url) : undefined}
                  last={i === CONTACTS.length - 1}
                />
              ))}
            </Group>
          </FadeIn>
        )}

        <FadeIn delay={180} style={{ gap: space.xs }}>
          <Text style={[type.overline, { color: colors.textMuted, marginLeft: 4 }]}>Laisser un avis</Text>
          <CommentBox navigation={navigation} item_id={shop_id} posted_by_id={user.id} item_type="shop" />
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  cover: { height: 170, backgroundColor: colors.sky100 },
  identity: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.lg,
    marginTop: -48,
    marginBottom: space.lg,
  },
  avatar: { borderRadius: 60, borderWidth: 4, borderColor: colors.bg, marginBottom: space.xs },
  actions: { flexDirection: "row", gap: space.xs, alignSelf: "stretch", marginTop: space.md },
  address: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: space.xs,
    padding: space.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  social: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
});
