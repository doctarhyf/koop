import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function ShopItem({ navigation, shop, favedShops, onFaveShop }) {
  const onShopBtnPress = (i) => {
    if (i === 0) {
      navigation.navigate("Shop", shop);
    } else {
      //alert(`Added "${shop.shop_name}" to favorite!`);
      const { id } = shop;

      onFaveShop(id);
    }
  };

  const isFaved = favedShops && favedShops.includes(shop.id);

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
        <Text style={{ color: "#999999" }}>@{shop.display_name}</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {[shop.items_count, shop.comments_count].map((dt, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 4 }}>
              {i === 0 ? (
                <FontAwesome5 name="bolt" size={18} color="#333" />
              ) : (
                <FontAwesome name="comments" size={18} color="#333" />
              )}
              <Text style={{ color: "#333" }}>{dt}</Text>
            </View>
          ))}
        </View>

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
                  backgroundColor:
                    i === 0 ? "#dddddd" : isFaved ? "purple" : "#ddd",
                  color: i === 0 ? "black" : isFaved ? "white" : "purple",
                  borderRadius: 8,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor:
                    i === 1 ? (isFaved ? "#0000" : "purple") : "#0000",
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
