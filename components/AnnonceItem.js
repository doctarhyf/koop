import { View, Text } from "react-native";
import React from "react";
import styles from "../helpers/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import * as FUNCS from "../helpers/funcs";

export default function AnnonceItem({ item, me }) {
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
      <FontAwesome5 name="bolt" size={24} color="green" />

      <View style={[styles.flex1]}>
        {!me && (
          <Text>
            <Text style={[styles.textBlue, styles.fontBold]}>
              {item.user_data.ville}
            </Text>
            - {item.user_data.display_name}
          </Text>
        )}
        <Text style={[{ fontWeight: "bold", flex: 1 }]}>{item.label}</Text>

        <Text style={[styles.textGray]}>
          {FUNCS.ParseCreatedAt(item.created_at).full}
        </Text>
      </View>
    </View>
  );
}
