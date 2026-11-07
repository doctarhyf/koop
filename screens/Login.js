import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageSlider from "../components/ImageSlider";
import { BrandBackdrop, Button, FadeIn, Input, Text, haptic } from "../components/ui";
import { IMG_SIZE } from "../helpers/flow";
import { colors, radius, space, type } from "../theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FUNCS from "../helpers/funcs";
import * as API from "../utils/api";

import UserContext from "../context/UserContext";
import ProfileSetup from "./ProfileSetup";

const phoneNumberPattern = /^\d{10}$/;
export default function Home({ navigation }) {
  const [loading, setloading] = useState(false);
  const [images, setImages] = useState([]);
  const [creds, setcreds] = useState({ phone: "", otp: "" });
  const [formaterror, setformaterror] = useState(null);
  const [logginSuccess, setLogginSuccess] = useState(false);

  const { user, setuser } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (phoneNumberPattern.test(creds.phone)) {
      setformaterror(null);
    } else {
      setformaterror("Invalid phone number format");
    }

    const fetchImages = async () => {
      await AsyncStorage.removeItem("tmp");
      const randomImages = await FUNCS.GetRandomImages(
        5,
        IMG_SIZE.w,
        IMG_SIZE.h
      );

      setImages(
        Array.isArray(randomImages)
          ? randomImages.map((img) => img?.urls?.regular).filter(Boolean)
          : []
      );
      checkUserLogin();
    };

    fetchImages();
  }, []);

  const saveSession = async (userData) => {
    setuser(userData);
    await AsyncStorage.setItem("@KOOP:user", JSON.stringify(userData));
  };

  const onRequestOtp = async () => {
    const { otp } = creds;

    if (otp === undefined || otp === null || otp.trim() === "") {
      Vibration.vibrate(250);
      alert("PIN cant be empty");
      return;
    }

    if (formaterror !== null) {
      Vibration.vibrate(250);
      alert("Invalid phone number", "The phone number enterred is invalid!");
      return;
    }
    setloading(true);

    const { phone, otp: pin } = creds;
    const userData = await API.login(phone, pin);

    if (userData.error) {
      const { error } = userData;

      if (error === "USER_NOT_FOUND") {
        setloading(false);
        Alert.alert(
          "User not found!",
          `User with phone number ${creds.phone} not found, do you wanna create a new account?`,
          [
            {
              text: "CREATE MY ACCOUNT",
              onPress: () => {
                navigation.replace(ProfileSetup.ROUTE, {
                  phone: creds.phone,
                });
              },
            },
            {
              text: "EXPLORE AS GUEST",
              destructive: true,
              onPress: () => {
                navigation.push("Explore");
              },
            },
          ],
          { cancelable: false }
        );
      } else if (error === "WRONG_PIN") {
        setloading(false);
        Alert.alert("Wrong PIN", "You have eneterred a wrong PIN!");
      } else {
        setloading(false);
        alert("Error login, try again later");
      }
    } else {
      setloading(false);
      setLogginSuccess(true);
      haptic("success");
      await saveSession(userData);
      navigation.replace("Home");
    }
  };

  const checkUserLogin = async () => {
    setloading(true);
    const user = await AsyncStorage.getItem("@KOOP:user");
    setloading(false);
    if (user) {
      console.log("found user => ", user);
      setLogginSuccess(true);
      setuser(JSON.parse(user));
      navigation.replace("Home");
    }
  };

  useEffect(() => {
    if (phoneNumberPattern.test(creds.phone)) {
      setformaterror(null);
    } else {
      setformaterror("Invalid phone number format");
    }
  }, [creds]);

  function onLoginValueChange(type, val) {
    setcreds((old) => ({ ...old, [type]: val }));
  }

  const phoneError =
    creds.phone.length > 0 && formaterror !== null
      ? "Numéro invalide — 10 chiffres attendus"
      : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <BrandBackdrop style={[st.hero, { paddingTop: insets.top + space.md }]}>
            <FadeIn style={{ gap: space.md }}>
              <Image
                contentFit="contain"
                source={require("../assets/koop.png")}
                style={st.logo}
              />
              <Text style={st.heroTitle}>Bon retour 👋</Text>
              <Text style={st.heroSub}>
                +1 million de services et de professionnels au bout de vos doigts
              </Text>
            </FadeIn>

            <FadeIn delay={120} style={st.sliderCard}>
              {images.length > 0 ? (
                <ImageSlider
                  images={images}
                  imageHeight={170}
                  dotSize={6}
                  dotColor="white"
                  activeDotColor="white"
                  showIndicatorDots={true}
                  autoSlideInterval={4500}
                  radius={0}
                />
              ) : (
                <View style={st.sliderPlaceholder}>
                  <Feather name="image" size={28} color="rgba(255,255,255,0.7)" />
                </View>
              )}
            </FadeIn>
          </BrandBackdrop>

          <View style={st.sheet}>
            {loading ? (
              <View style={st.loader}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[type.small, { color: colors.textMuted }]}>
                  Connexion en cours…
                </Text>
              </View>
            ) : (
              <FadeIn delay={200} style={{ gap: space.lg }}>
                <View style={{ gap: 6 }}>
                  <Text style={type.h1}>Se connecter</Text>
                  <Text style={[type.body, { color: colors.textMuted }]}>
                    Entrez votre numéro de téléphone. Le PIN par défaut est{" "}
                    <Text style={{ fontWeight: "700", color: colors.text }}>0000</Text>.
                  </Text>
                </View>

                <Input
                  label="Téléphone"
                  icon="phone"
                  maxLength={10}
                  keyboardType="phone-pad"
                  placeholder="0980 967 780"
                  value={creds.phone || ""}
                  error={phoneError}
                  onChangeText={(text) => onLoginValueChange("phone", text)}
                />

                <Input
                  label="Code PIN"
                  icon="lock"
                  keyboardType="number-pad"
                  secureTextEntry
                  placeholder="••••"
                  value={creds.otp || ""}
                  maxLength={6}
                  onChangeText={(text) => onLoginValueChange("otp", text)}
                />

                <Button
                  title="Continuer"
                  iconRight="arrow-right"
                  loading={loading}
                  onPress={onRequestOtp}
                />

                <View style={st.secure}>
                  <Feather name="shield" size={14} color={colors.textFaint} />
                  <Text style={[type.caption, { color: colors.textFaint }]}>
                    Connexion sécurisée · Vos données restent privées
                  </Text>
                </View>
              </FadeIn>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const st = StyleSheet.create({
  hero: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl + space.md,
    gap: space.xl,
  },
  logo: { width: 96, height: 40 },
  heroTitle: { ...type.h1, color: "#fff" },
  heroSub: { ...type.body, color: "rgba(255,255,255,0.85)" },
  sliderCard: {
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  sliderPlaceholder: { height: 170, alignItems: "center", justifyContent: "center" },
  sheet: {
    flex: 1,
    marginTop: -space.xxl,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  loader: { alignItems: "center", gap: space.sm, paddingVertical: space.xxxl },
  secure: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
});
