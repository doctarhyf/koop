import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";

export default function ShopItem({ shop }) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        gap: 12,
        flex: 1,
      }}
    >
      <Image
        source={require("../assets/rhyf.png")}
        style={{
          width: 90,
          borderRadius: 45,
          overflow: "hidden",
          height: 90,
        }}
      />
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Shop name</Text>
        <Text style={{ color: "#999999" }}>user name - 8 com - 12 items</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {["Details", "Favorite"].map((it, i) => (
            <Text
              style={{
                padding: 8,
                backgroundColor: "purple",
                color: "white",
                borderRadius: 8,
                overflow: "hidden",
              }}
              key={i}
            >
              {it}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
