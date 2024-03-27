import React from "react";
import { ScrollView, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function TOS() {
  return (
    <WebView
      source={{ uri: "https://konext.vercel.app/" }}
      style={{ flex: 1 }}
    />
  );
}
