import { View, Text } from "react-native";
import React from "react";
import styles from "../helpers/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import * as FUNCS from "../helpers/funcs";
import { Image } from "expo-image";

export default function AnnonceItem({ item, me, showProfile }) {
  return (
    <View
      style={[
        styles.flexRow,
        styles.flex1,
        styles.alignCenter,
        {
          gap: 8,
          padding: 8,
          borderColor: "#ddd",
          marginBottom: 8,
          borderWidth: 1,
          borderRadius: 8,
        },
      ]}
    >
      {showProfile ? (
        <Image
          source={item.user_data.profile}
          style={[
            { width: 60, height: 60, borderRadius: 30, overflow: "hidden" },
          ]}
        />
      ) : (
        <FontAwesome5 name="bolt" size={24} color="green" />
      )}

      <View style={[styles.flex1]}>
        <Text>
          <Text style={[styles.textBlue, styles.fontBold]}>
            {item.user_data.ville}
          </Text>
          - {me ? "Moi" : item.user_data.display_name}
        </Text>

        <Text style={[{ fontWeight: "bold", flex: 1 }]}>{item.label}</Text>

        <Text style={[styles.textGray]}>{item.timeAgo}</Text>
      </View>
    </View>
  );
}
