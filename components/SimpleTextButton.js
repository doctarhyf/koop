import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../helpers/styles";

export default function SimpleTextButton({ text, handlePress }) {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.textBlue, styles.textCenter, styles.paddingMid]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
