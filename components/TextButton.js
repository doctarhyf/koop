import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { KOOP_BLUE } from "../helpers/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../helpers/styles";

export default function TextButton({
  label,
  handlePress,
  iconName = "",
  customStyles = [],
}) {
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.flexRow,
          customStyles,
          styles.justifyBetween,
          styles.alignCenter,
        ]}
      >
        <Icon name={iconName} size={20} style={{ color: KOOP_BLUE }} />
        <View style={[{ width: 5 }]}></View>
        <Text style={[{ color: KOOP_BLUE }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
