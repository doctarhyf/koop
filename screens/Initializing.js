import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import {
  BackHandler,
  Alert,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BrandBackdrop, FadeIn, Text } from "../components/ui";
import { radius, space, type } from "../theme";
import styles from "../helpers/styles";
import { insertItem, uploadFile } from "../utils/db";
import { TABLE_NAMES, supabase } from "../utils/supabase";
import UserContext from "../context/UserContext";
import { decode } from "base64-arraybuffer";
import { getPublicUrl } from "../utils/db";
import useFileUpload from "../hooks/useFileUpload";
import { SBFileUpload } from "../helpers/funcs";

const SPLASH = require("../assets/images/splash.jpg");
const KOOP = require("../assets/koop.png");
const LOGO_WIDTH = 120;
const LOGO_HEIGHT = 80;

function Initializing({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(true);

  const profileData = route.params;
  const { phone, profile, shop_profile, display_name, shop_name } = profileData;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    const createAccounts = async () => {
      let newUserData = { ...profileData };

      const curTime = new Date().getTime();

      const profile_server_path = `user_${phone}/profile_${curTime}.jpg`;
      const profile_public_url = await SBFileUpload(
        profile,
        profile_server_path
      );

      newUserData.profile = profile_public_url;

      const shop_profile_server_path = `user_${phone}/shop_profile_${curTime}.jpg`;
      const shop_profile_public_url = await SBFileUpload(
        shop_profile,
        shop_profile_server_path
      );

      newUserData.shop_profile = shop_profile_public_url;

      //alert(JSON.stringify(newUserData));

      let insertedUsedData = await insertItem(
        TABLE_NAMES.KOOP_USERS,
        newUserData
      );

      if (insertedUsedData && insertedUsedData.length === 1) {
        setuser(insertedUsedData[0]);
        await AsyncStorage.setItem(
          "@KOOP:user",
          JSON.stringify(insertedUsedData[0])
        );

        Alert.alert(
          "New account created",
          `Hello ${display_name}, you new account and your shop ${shop_name} have been created successfully!`,
          [
            {
              text: "START",
              onPress: () => {
                navigation.replace("Home");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error adding user",
          `Res: ${JSON.stringify(
            insertedUsedData
          )}`,
          [
            {
              text: "RETRY",
              onPress: () => {
                navigation.replace("Login");
              },
            },
          ]
        );
        console.error("Error adding user : \n", insertedUsedData);
      }
    };

    createAccounts();

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    return true;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <BrandBackdrop style={st.cont}>
      <FadeIn style={{ alignItems: "center", gap: space.lg }}>
        <View style={st.ring}>
          <ImageBackground source={SPLASH} style={st.splash} imageStyle={{ borderRadius: 110 }}>
            <View style={st.logoChip}>
              <Image source={KOOP} style={st.koop} />
            </View>
          </ImageBackground>
        </View>
        <Text style={st.title}>Création de votre espace…</Text>
        <Text style={st.wait}>
          Nous préparons votre profil et votre boutique. Cela ne prend que quelques secondes.
        </Text>
        <ActivityIndicator animating={loading} color="#fff" style={{ marginTop: space.sm }} />
      </FadeIn>
    </BrandBackdrop>
  );
}

Initializing.ROUTE = "Initializing";

export default Initializing;

const st = StyleSheet.create({
  cont: { flex: 1, justifyContent: "center", alignItems: "center", padding: space.xl },
  ring: {
    padding: 6,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  splash: { width: 220, height: 220, justifyContent: "flex-end", alignItems: "center" },
  logoChip: {
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(11,18,32,0.55)",
  },
  koop: { width: LOGO_WIDTH * 0.6, height: LOGO_HEIGHT * 0.35, resizeMode: "contain" },
  title: { ...type.h2, color: "#fff", textAlign: "center" },
  wait: { ...type.body, color: "rgba(255,255,255,0.82)", textAlign: "center", maxWidth: 300 },
});
