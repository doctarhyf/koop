import Text from "../components/ui/Text";
import React from "react";
import { ScrollView } from "react-native";
import { WebView } from "react-native-webview";

export default function TOS() {
  return (
    <WebView
      source={{ uri: "https://konext.vercel.app/tos" }}
      style={{ flex: 1 }}
    />
  );
}
