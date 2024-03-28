import React, { useEffect, useLayoutEffect } from "react";
import styles from "../helpers/styles";
import { View } from "react-native";
import { height } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import { Image } from "expo-image";
export default function PhotoViewer({ route, navigation }) {
  const { params } = route;

  return (
    <View style={[styles.flex1, styles.bgBlack]}>
      <Image
        transition={1000}
        source={{ uri: params } || require("../assets/koop.png")}
        style={[styles.flex1, { width: "100%", height: "100%" }]}
      />
    </View>
  );
}
