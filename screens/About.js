import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { KOOP_BLUE } from "../helpers/colors";
import Constants from "expo-constants";

export default function About() {
  const { version, name } = Constants.expoConfig;
  const appName = name.toUpperCase();

  const showAbout = () => {
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
