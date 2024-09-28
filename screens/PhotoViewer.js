import React from "react";
//import styles from "../helpers/styles";
import { Image } from "expo-image";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

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
