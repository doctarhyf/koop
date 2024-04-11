import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { KOOP_BLUE_TRANSLUCIDE } from "../helpers/colors";

export default function ImagesViewer({ images, navigation }) {
  return images.length === 0 ? null : (
    <ScrollView horizontal>
      {images.map((img, i) => (
        <TouchableOpacity
          onPress={(e) => navigation.navigate("PhotoViewer", img)}
        >
          <Image
            transition={1000}
            source={img}
            style={{
              height: 180,
              width: 280,
              margin: 12,
              backgroundColor: KOOP_BLUE_TRANSLUCIDE,
              borderRadius: 12,
            }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
