import React from "react";
import { Text } from "react-native";

export default function ViewMessage({ route }) {
  const messageItem = route.params;

  return <Text>{messageItem.message}</Text>;
}
