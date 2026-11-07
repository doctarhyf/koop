import Icon from "@expo/vector-icons/FontAwesome";
import React from "react";
import { View } from "react-native";
import { colors, fonts } from "../theme";
import { PressableScale, Text } from "./ui";

export default function TextButton({ label, handlePress, iconName = "", customStyles = [] }) {
  return (
    <PressableScale onPress={handlePress}>
      <View style={[{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10 }, customStyles]}>
        {iconName ? <Icon name={iconName} size={18} color={colors.primary} /> : null}
        <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>{label}</Text>
      </View>
    </PressableScale>
  );
}
