import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import {
  Text,
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
import { KOOP_BLUE } from "../helpers/colors";
import styles from "../helpers/styles";
import { insertItem, uploadFile } from "../utils/db";
import { TABLE_NAMES, supabase } from "../utils/supabase";
import UserContext from "../context/UserContext";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { getPublicUrl } from "../utils/db";

const SPLASH = require("../assets/images/splash.jpg");
const KOOP = require("../assets/koop.png");
const LOGO_WIDTH = 120;
const LOGO_HEIGHT = 80;

export default function Initializing({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    const createAccounts = async () => {
      const { businessName, profilePic, userName, phone } = route.params;

      let newUserData = {
        phone: phone,
        display_name: userName,
        shop_name: businessName,
      };

      if (profilePic && profilePic.length > 0) {
        const uri = profilePic;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const filePath = `user_${phone}/profile_${new Date().getTime()}.jpg`;
        const contentType = "image/jpg";

        const { data, error } = await supabase.storage
          .from("koop")
          .upload(filePath, decode(base64), { contentType });

        console.log("Profile pic uploaded! data => ", data);
        if (data !== null && data.fullPath) {
          const publicURL = await getPublicUrl(
            data.fullPath.replace("koop/", "")
          );
          console.error("real path => ", publicURL);
          newUserData.profile = publicURL;
        }
      }

      let res = await insertItem(TABLE_NAMES.KOOP_USERS, newUserData);

      if (res && res.length === 1) {
        setuser(res[0]);
        await AsyncStorage.setItem("@KOOP:user", JSON.stringify(res[0]));

        Alert.alert(
          "New account created",
          `Hello ${userName}, you new account and your shop ${businessName} have been created successfully!`,
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
          `Error: ${JSON.stringify(error)}\nRes: ${JSON.stringify(res)}`,
          [
            {
              text: "RETRY",
              onPress: () => {
                navigation.replace("Login");
              },
            },
          ]
        );
        console.error("Error adding user : \n", res, error);
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
    <View style={[st.cont]}>
      <Text style={[st.title]}>Initializing ...</Text>
      <Text style={[st.wait]}>Please wait a moment</Text>

      <ImageBackground source={SPLASH} style={[st.splashcont]}>
        <View
          style={[
            styles.bgBlue,
            st.koopcont,
            { width: LOGO_WIDTH, height: LOGO_HEIGHT },
          ]}
        >
          <Image source={KOOP} style={[st.koop]} />
        </View>
      </ImageBackground>

      <View style={[styles.flex1]} />
      <ActivityIndicator animating={loading} />
    </View>
  );
}

const st = StyleSheet.create({
  koopcont: {
    position: "absolute",
    right: 0,
    bottom: 50,
    padding: 4,
  },
  koop: {
    width: LOGO_WIDTH - 10,
    height: LOGO_HEIGHT - 20,
    resizeMode: "contain",
  },
  cont: {
    marginVertical: 64,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: KOOP_BLUE,
    marginBottom: 12,
  },
  wait: {
    marginBottom: 12,
  },
  splashcont: {
    marginTop: 32,
    borderRadius: 120,

    width: 240,
    height: 240,
    overflow: "hidden",
  },
  splashimg: {
    resizeMode: "contain",
    width: 340,
    height: 340,
  },
});
