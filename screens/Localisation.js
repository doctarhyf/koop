import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import styles from "../helpers/styles";

const bg = require("../assets/images/gps.jpg");

export default function Localisation() {
  return (
    <View style={[styles.flex1, styles.flexCol, styles.bgBlack]}>
      <View style={[st.cont]}>
        <Image source={bg} style={[st.img]} />
      </View>
      <View style={[styles.paddingSmall]}>
        <Text style={[styles.textWhite]}>Location</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  cont: {
    height: 180,
    backgroundColor: "#ff0000",
    width: "100%",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
});
