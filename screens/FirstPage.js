import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandBackdrop, Button, FadeIn, Text } from "../components/ui";
import { fonts, radius, space, type } from "../theme";

const FEATURES = [
  { icon: "zap", title: "Publiez en 30 secondes", desc: "Annonces, demandes, services." },
  { icon: "message-circle", title: "Discutez en direct", desc: "Messagerie instantanée avec les vendeurs." },
  { icon: "shield", title: "Boutiques vérifiées", desc: "Des pros près de chez vous, partout en RDC." },
];

export default function FirstPage({ navigation }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const agreed = await AsyncStorage.getItem("agreed");
      if (agreed === "true") navigation.replace("Login");
      else setReady(true);
    })();
  }, []);

  const onAgreeTOS = async () => {
    await AsyncStorage.setItem("agreed", "true");
    navigation.replace("Login");
  };

  return (
    <BrandBackdrop style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {ready && (
          <View style={st.wrap}>
            <FadeIn style={st.hero}>
              <View style={st.logoPill}>
                <Image source={require("../assets/koop.png")} style={st.logo} contentFit="contain" />
              </View>
              <Text style={st.title}>
                Le marché local,{"\n"}
                <Text style={{ color: "#CFE6FF" }}>réinventé.</Text>
              </Text>
              <Text style={st.subtitle}>
                Plus d'un million de services et de professionnels au bout de vos doigts.
              </Text>
            </FadeIn>

            <View style={{ gap: space.sm }}>
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={150 + i * 90}>
                  <View style={st.feature}>
                    <View style={st.featureIcon}>
                      <Feather name={f.icon} size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.featureTitle}>{f.title}</Text>
                      <Text style={st.featureDesc}>{f.desc}</Text>
                    </View>
                  </View>
                </FadeIn>
              ))}
            </View>

            <FadeIn delay={500} style={{ gap: space.md }}>
              <Button
                title="Accepter et continuer"
                iconRight="arrow-right"
                variant="light"
                onPress={onAgreeTOS}
              />
              <Text style={st.legal}>
                En continuant, vous acceptez nos{" "}
                <Text
                  style={st.link}
                  onPress={() => navigation.navigate("TOS", undefined, { pop: true })}
                >
                  Termes et conditions
                </Text>{" "}
                d'utilisation.
              </Text>
            </FadeIn>
          </View>
        )}
      </SafeAreaView>
    </BrandBackdrop>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, padding: space.xl, justifyContent: "space-between" },
  hero: { gap: space.md, marginTop: space.xl },
  logoPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  logo: { width: 88, height: 34 },
  title: { ...type.display, fontSize: 40, lineHeight: 46, color: "#fff" },
  subtitle: { ...type.body, fontSize: 16, color: "rgba(255,255,255,0.85)", maxWidth: 320 },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { fontFamily: fonts.bold, fontSize: 15, color: "#fff" },
  featureDesc: { ...type.small, color: "rgba(255,255,255,0.78)" },
  legal: { ...type.small, textAlign: "center", color: "rgba(255,255,255,0.8)" },
  link: { fontFamily: fonts.bold, color: "#fff", textDecorationLine: "underline" },
});
