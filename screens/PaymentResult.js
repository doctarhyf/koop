import { View, Text, ScrollView } from "react-native";
import { Image } from "expo-image";
import React from "react";
import styles from "../helpers/styles";
import SimpleTextButton from "../components/SimpleTextButton";

export default function PaymentResult({ navigation }) {
  return (
    <ScrollView>
      <View
        style={[
          styles.flex1,
          styles.justifyCenter,
          styles.alignCenter,
          styles.paddingMid,
        ]}
      >
        <Image
          source={require("../assets/icons/success.png")}
          style={[{ width: 80, height: 80 }, styles.marginLarge]}
          contentFit="contain"
        />
        <Text>Your payment has been processed successfully</Text>
        <SimpleTextButton
          text={"OK"}
          handlePress={(e) => navigation.replace("Home")}
        />
      </View>
    </ScrollView>
  );
}
