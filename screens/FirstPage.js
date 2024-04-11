import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import styles from "../helpers/styles";
import { KOOP_BLUE } from "../helpers/colors";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FirstPage({ navigation, route }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [route]);

  useEffect(() => {
    checkTOSAgreed();
  }, []);

  const checkTOSAgreed = async () => {
    const agreed = await AsyncStorage.getItem("agreed");

    if (agreed === "true") {
      navigation.replace("Login");
    }
  };

  const onAgreeTOS = async (e) => {
    const r = await AsyncStorage.setItem("agreed", "true");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: KOOP_BLUE }]}>
      <View
        style={[
          styles.justifyCenter,
          styles.marginLarge,
          styles.alignCenter,
          styles.flex1,
        ]}
      >
        <Image
          contentFit="contain"
          source={require("../assets/koop.png")}
          style={[{ width: "100%", height: "30%" }]}
        />
        <View style={[styles.flex1]}></View>
        <Text style={[styles.textCenter, styles.marginLarge, styles.textWhite]}>
          Avant de continuer avec KOOP vous devez accepter nos{" "}
          <TouchableOpacity onPress={(e) => navigation.navigate("TOS")}>
            <Text style={[{ color: "#0000ff" }]}>Termes et conditions</Text>
          </TouchableOpacity>
          d'utilisation
        </Text>
        <TouchableOpacity onPress={(e) => onAgreeTOS()}>
          <Text sty>Agree and Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
