import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileBadge({ profile, display_name, phone }) {
  return (
    <View style={[styles.flexRow, { gap: 8, padding: 12 }, styles.alignCenter]}>
      <LinearGradient
        colors={["rgba(255,255,255,.5)", "rgba(255,255,255,1)"]}
        style={st.gradient}
      />
      <Image
        source={profile}
        style={{ width: 60, height: 60, borderRadius: 30 }}
        transition={1000}
      />
      <View>
        <Text style={{ fontWeight: "bold" }}>{display_name}</Text>
        <Text style={{ color: "#000000aa" }}>{phone}</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
