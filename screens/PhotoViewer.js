import React, { useEffect, useLayoutEffect } from "react";
import styles from "../helpers/styles";
import { View, Image } from "react-native";
import { height } from "deprecated-react-native-prop-types/DeprecatedImagePropType";

export default function PhotoViewer({ route, navigation }) {
  const { params } = route;

  return (
    <View style={[styles.flex1, styles.bgBlack]}>
      <Image
        source={{ uri: params } || require("../assets/koop.png")}
        style={[styles.flex1, { width: "100%", height: "100%" }]}
      />
    </View>
  );
}
