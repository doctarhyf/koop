import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  Vibration,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import { KOOP_BLUE } from "../helpers/colors";
import Constants from "expo-constants";

export default function About() {
  const { version, name } = Constants.expoConfig;
  const appName = name.toUpperCase();

  const showAbout = () => {
    Vibration.vibrate(250);

    const cont = `Code & Design by
    Franvale MK A.K.A @doctarhyf
    E-mail: drrhyf@gmail.com
    微信:drrhyf
    GitHub:
    https://github.com/doctarhyf
    -- 👽😜 --`;
    Alert.alert("About", cont);
  };

  return (
    <View style={[st.cont]}>
      <Pressable onLongPress={showAbout}>
        <Image source={require("../assets/koop.png")} style={[st.img]} />
      </Pressable>
      <View style={[{ padding: 8 }]}>
        <Text style={[st.app_name]}>{appName}</Text>
        <Text>Version: {version}</Text>
        <Text>Copyright © 2024 KOOP Inc.</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  cont: {
    flex: 1,
  },
  img: {
    height: 280,
    backgroundColor: KOOP_BLUE,
    width: "100%",
    resizeMode: "contain",
  },
  app_name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
