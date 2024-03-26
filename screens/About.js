import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { KOOP_BLUE } from "../helpers/colors";

export default function About() {
  return (
    <View style={[st.cont]}>
      <Image source={require("../assets/koop.png")} style={[st.img]} />
      <View style={[{ padding: 8 }]}>
        <Text style={[st.app_name]}>KOOP</Text>
        <Text>Version: 1.0.1.07.1827</Text>
        <Text>Copyright @ 2024 KOOP Inc.</Text>
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
