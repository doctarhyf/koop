import React, { useLayoutEffect } from "react";
import { Text } from "react-native";

export default function ViewAll({ route, navigation }) {
  const { params } = route;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params,
    });
  }, [navigation]);

  return <Text>ViewAll</Text>;
}
