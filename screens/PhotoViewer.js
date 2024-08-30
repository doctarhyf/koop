import React, { useEffect, useLayoutEffect } from "react";
//import styles from "../helpers/styles";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";

export default function PhotoViewer({ route, navigation }) {
  const { params } = route;

  return (
    <ScrollView
      maximumZoomScale={5}
      minimumZoomScale={1}
      contentContainerStyle={styles.scrollContainer}
      horizontal
    >
      <ScrollView
        maximumZoomScale={5}
        minimumZoomScale={1}
        contentContainerStyle={styles.scrollContainer}
      >
        <Image
          source={params || require("../assets/koop.png")}
          style={styles.image}
          contentFit="contain"
        />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: Dimensions.get("window").width, //* 2, // or set a specific width
    height: Dimensions.get("window").height, //* 2, // or set a specific height
  },
});

/* return (
    <View style={[styles.flex1, styles.bgBlack]}>
      <Image
        transition={1000}
        source={params || require("../assets/koop.png")}
        style={[styles.flex1, { width: "100%", height: "100%" }]}
      />
    </View>
  );
}
 */
