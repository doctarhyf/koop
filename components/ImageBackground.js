import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";

export default function ImageBackground({
  source,
  imgProps,
  children,
  width = 100,
  height = 100,
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          width: width,
          height: height,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: width / 2,
        },
      ]}
    >
      <Image
        source={source}
        {...imgProps}
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            flex: 1,
            height: height,
            width: width,
          },
        ]}
      />
      {children}
    </View>
  );
}
