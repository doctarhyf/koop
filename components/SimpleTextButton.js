import React from "react";
import { colors, fonts, space } from "../theme";
import { PressableScale, Text } from "./ui";

export default function SimpleTextButton({ text, handlePress }) {
  return (
    <PressableScale onPress={handlePress} style={{ padding: space.md, alignItems: "center" }}>
      <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 15 }}>{text}</Text>
    </PressableScale>
  );
}
