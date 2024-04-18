import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Test() {
  const [data, setdata] = useState([]);

  const loadStorage = async () => {
    const dt = await AsyncStorage.getItem("data");
    alert(JSON.parse(dt).length);
  };

  const saveNew = async () => {
    setdata((prev) => [...prev, Math.random()]);
  };

  useEffect(() => {
    async function s() {
      await AsyncStorage.setItem("data", JSON.stringify(data));
    }

    s();
  }, [data]);

  return (
    <View>
      <Button onPress={(e) => loadStorage()} title="Load" />
      <Button onPress={(e) => saveNew()} title="Save" />
    </View>
  );
}
