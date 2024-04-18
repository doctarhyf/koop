import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";

export default function ShopItem({ navigation, shop }) {
  const onShopBtnPress = (i) => {
    if (i === 0) {
      navigation.navigate("Shop", shop);
    } else {
      alert(`Added "${shop.shop_name}" to favorite!`);
    }
  };

  return (
    <View
      style={{
        borderBottomColor: "#dddddd",
        borderBottomWidth: 1,
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        gap: 12,
        flex: 1,
      }}
    >
      <Image
        transition={1000}
        source={shop.shop_profile}
        style={{
          width: 90,
          borderRadius: 45,
          overflow: "hidden",
          height: 90,
        }}
      />
      <View
        style={{
          flex: 1,
          gap: 8,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {shop.shop_name}
        </Text>
        <Text style={{ color: "#999999" }}>
          @{shop.display_name} - 8 com - 12 items
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          {["View", "Favorite"].map((it, i) => (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={(e) => onShopBtnPress(i)}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 8,
                  backgroundColor: i === 0 ? "#dddddd" : "purple",
                  color: i === 0 ? "black" : "white",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                key={i}
              >
                {it}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
