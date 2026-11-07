import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalMenu from "../components/ModalMenu";
import {
  Avatar,
  Badge,
  BrandBackdrop,
  FadeIn,
  IconButton,
  PressableScale,
  Text,
} from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, fonts, gradients, radius, shadows, space, type } from "../theme";

const TILES = [
  {
    route: "Look",
    title: "Découvrir",
    desc: "Toutes les annonces",
    icon: "compass",
    tint: colors.primary,
    bg: colors.primarySoft,
  },
  {
    route: "Inbox",
    title: "Messages",
    desc: "Vos conversations",
    icon: "message-circle",
    tint: colors.success,
    bg: colors.successSoft,
  },
  {
    route: "MyItems",
    title: "Mes annonces",
    desc: "Gérer vos posts",
    icon: "layers",
    tint: colors.violet,
    bg: colors.violetSoft,
  },
  {
    route: "Other",
    title: "Services",
    desc: "GPS, crédit, argent",
    icon: "grid",
    tint: "#D97706",
    bg: colors.warningSoft,
  },
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
};

const SetupCard = ({ onOpen, onClose }) => (
  <FadeIn delay={260}>
    <View style={[st.setup, shadows.sm]}>
      <View style={st.setupIcon}>
        <Image
          source={require("../assets/icons/store.png")}
          style={{ width: 30, height: 30 }}
          contentFit="contain"
        />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.bodyStrong}>Complétez votre boutique</Text>
        <Text style={[type.small, { color: colors.textMuted }]}>
          Un profil complet attire 3× plus de clients.
        </Text>
        <PressableScale onPress={onOpen} style={st.setupLink}>
          <Text style={[type.small, { color: colors.primary, fontFamily: fonts.bold }]}>
            Terminer la configuration
          </Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </PressableScale>
      </View>
      <IconButton name="x" size={30} border={false} bg={colors.cardAlt} color={colors.textMuted} onPress={onClose} />
    </View>
  </FadeIn>
);

const Home = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isInfoPaneVisible, setIsInfoPaneVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const visible = (await AsyncStorage.getItem("info_pane")) === null;
      setIsInfoPaneVisible(visible);
    })();
  }, []);

  const go = (route, params) => navigation.navigate(route, params, { pop: true });

  const onCloseInfoPane = async () => {
    AsyncStorage.setItem("info_pane", "false");
    setIsInfoPaneVisible(false);
  };

  const firstName = (user?.display_name || "").split(" ")[0];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={st.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FadeIn style={st.header}>
          <PressableScale onPress={() => go("MyAccount", user)} style={st.headerLeft}>
            <Avatar uri={user?.profile} name={user?.display_name} size={46} ring />
            <View>
              <Text style={[type.small, { color: colors.textMuted }]}>{greeting()},</Text>
              <Text style={type.h3} numberOfLines={1}>
                {firstName || "bienvenue"}
              </Text>
            </View>
          </PressableScale>
          <View style={{ flexDirection: "row", gap: space.xs }}>
            <IconButton name="search" onPress={() => go("Search", "koop_sreqs")} />
            <IconButton name="menu" onPress={() => setMenuVisible(true)} />
          </View>
        </FadeIn>

        {/* Hero */}
        <FadeIn delay={80}>
          <PressableScale onPress={() => go("ServiceRequest")} scaleTo={0.985} hapticKind="medium">
            <BrandBackdrop style={[st.hero, shadows.glow]}>
              <View style={{ flex: 1, gap: space.xs }}>
                <Badge label="NOUVEAU" tone="glass" />
                <Text style={st.heroTitle}>Besoin de quelque chose ?</Text>
                <Text style={st.heroSub}>
                  Publiez une annonce et recevez des offres de pros en quelques minutes.
                </Text>
                <View style={st.heroCta}>
                  <Feather name="plus" size={16} color={colors.primary} />
                  <Text style={{ fontFamily: fonts.bold, color: colors.primary, fontSize: 14 }}>
                    Nouvelle annonce
                  </Text>
                </View>
              </View>
              <Image
                source={require("../assets/koop.png")}
                style={st.heroLogo}
                contentFit="contain"
              />
            </BrandBackdrop>
          </PressableScale>
        </FadeIn>

        {isInfoPaneVisible && (
          <SetupCard onOpen={() => go("MyAccount", user)} onClose={onCloseInfoPane} />
        )}

        {/* Quick actions */}
        <FadeIn delay={160}>
          <Text style={[type.h3, { marginBottom: space.sm }]}>Que voulez-vous faire ?</Text>
          <View style={st.grid}>
            {TILES.map((t) => (
              <PressableScale key={t.route} onPress={() => go(t.route)} style={[st.tile, shadows.xs]}>
                <View style={[st.tileIcon, { backgroundColor: t.bg }]}>
                  <Feather name={t.icon} size={22} color={t.tint} />
                </View>
                <View style={{ gap: 2 }}>
                  <Text style={type.title}>{t.title}</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>{t.desc}</Text>
                </View>
                <Feather name="arrow-up-right" size={18} color={colors.textFaint} style={st.tileArrow} />
              </PressableScale>
            ))}
          </View>
        </FadeIn>

        {/* Premium teaser */}
        <FadeIn delay={240}>
          <PressableScale onPress={() => go("PremiumSubscriptions")} scaleTo={0.985}>
            <LinearGradient
              colors={gradients.aurora}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={st.premium}
            >
              <View style={st.premiumIcon}>
                <Feather name="star" size={20} color="#FCD34D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, color: "#fff", fontSize: 15 }}>
                  Passez à KOOP Premium
                </Text>
                <Text style={[type.small, { color: "rgba(255,255,255,0.7)" }]}>
                  Annonces en tête des résultats, visibilité maximale.
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </PressableScale>
        </FadeIn>
      </ScrollView>

      <ModalMenu
        navigation={navigation}
        isMenuVisible={isMenuVisible}
        closeMenu={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Home;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxxl },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: space.sm, flexShrink: 1 },
  hero: {
    borderRadius: radius.xl,
    padding: space.lg,
    flexDirection: "row",
    overflow: "hidden",
    minHeight: 180,
  },
  heroTitle: { ...type.h2, color: "#fff", marginTop: 4 },
  heroSub: { ...type.small, color: "rgba(255,255,255,0.85)", maxWidth: 240 },
  heroCta: {
    marginTop: space.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  heroLogo: {
    position: "absolute",
    right: -10,
    bottom: 14,
    width: 110,
    height: 50,
    opacity: 0.25,
  },
  setup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  setupIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  setupLink: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  tile: {
    flexBasis: "46%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.lg,
  },
  tileIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tileArrow: { position: "absolute", top: space.md, right: space.md },
  premium: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.lg,
  },
  premiumIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(252,211,77,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
