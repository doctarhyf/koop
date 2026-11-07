import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { useContext } from "react";
import { Alert, Platform, ScrollView, Share, StyleSheet, View } from "react-native";
import { Avatar, BrandBackdrop, FadeIn, Group, ListRow, Text } from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, radius, space, type } from "../theme";

const SECTIONS = [
  {
    title: "Sécurité",
    data: [
      { text: "Changer le PIN", sub: "Code à 4–6 chiffres", icon: "lock", route: "change_pin" },
      { text: "Face ID", sub: "Déverrouillage biométrique", icon: "smile", route: "face_id", os: "ios" },
    ],
  },
  {
    title: "Aide et contact",
    data: [
      { text: "Partager l'application", icon: "share-2", route: "share_app", tint: colors.success, bg: colors.successSoft },
      { text: "Termes et conditions", icon: "file-text", route: "terms_and_cond", tint: colors.slate, bg: colors.lineSoft },
      { text: "Nous contacter", icon: "life-buoy", route: "contact_us", tint: colors.violet, bg: colors.violetSoft },
      { text: "À propos", icon: "info", route: "about", tint: colors.slate, bg: colors.lineSoft },
    ],
  },
  {
    title: "Compte",
    data: [{ text: "Se déconnecter", icon: "log-out", route: "signout", destructive: true }],
  },
];

const Settings = ({ navigation }) => {
  const { user, setuser } = useContext(UserContext);

  const shareLink = async () => {
    try {
      const applink = "https://konext.app/";
      await Share.share({
        message: `Salut ! 👋 Je voulais te faire découvrir KOOP, une super application pour trouver des clients et des articles rares. Télécharge-la gratuitement : ${applink} 😊 #KOOP`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const signout = async () => {
    await AsyncStorage.removeItem("@KOOP:user");
    navigation.replace("Login");
  };

  const onSettingsPress = ({ route }) => {
    if (route === "about") navigation.navigate("About", undefined, { pop: true });
    if (route === "contact_us") navigation.navigate("ContactUs", undefined, { pop: true });
    if (route === "change_pin")
      navigation.navigate("ChangePIN", { user, setuser }, { pop: true });
    if (route === "terms_and_cond")
      navigation.navigate("TOS", { user, setuser }, { pop: true });
    if (route === "share_app") shareLink();
    if (route === "signout") {
      Alert.alert("Se déconnecter", "Voulez-vous vraiment vous déconnecter ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: signout },
      ]);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space.lg, gap: space.xl, paddingBottom: space.xxxl }}
    >
      <FadeIn>
        <BrandBackdrop style={st.head}>
          <Avatar uri={user?.profile} name={user?.display_name} size={60} />
          <View style={{ flex: 1 }}>
            <Text style={[type.h3, { color: "#fff" }]} numberOfLines={1}>{user?.display_name}</Text>
            <Text style={[type.small, { color: "rgba(255,255,255,0.85)" }]}>{user?.phone}</Text>
          </View>
        </BrandBackdrop>
      </FadeIn>

      {SECTIONS.map((section, si) => {
        const rows = section.data.filter((it) => !it.os || it.os === Platform.OS);
        return (
          <FadeIn key={section.title} delay={80 + si * 60}>
            <Group title={section.title}>
              {rows.map((it, i) => (
                <ListRow
                  key={it.route}
                  icon={it.icon}
                  iconColor={it.tint}
                  iconBg={it.bg}
                  title={it.text}
                  subtitle={it.sub}
                  destructive={it.destructive}
                  onPress={() => onSettingsPress(it)}
                  last={i === rows.length - 1}
                />
              ))}
            </Group>
          </FadeIn>
        );
      })}

      <Text style={[type.caption, { textAlign: "center", color: colors.textFaint }]}>
        KOOP v{Constants.expoConfig?.version || "1.0.0"} · Fait avec ❤️ en RDC
      </Text>
    </ScrollView>
  );
};

const st = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.xl,
    overflow: "hidden",
  },
});

export default Settings;
