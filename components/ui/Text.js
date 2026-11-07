import React, { createContext, useContext } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
} from "react-native";
import { colors, fontForWeight, fonts } from "../../theme";

const InsideText = createContext(false);

// Resolves fontWeight → Plus Jakarta family so every Text in the app shares the brand typeface.
function resolveFont(style, nested) {
  const flat = StyleSheet.flatten(style) || {};
  if (flat.fontFamily) return flat;
  if (nested && flat.fontWeight == null) return flat; // inherit parent family
  const { fontWeight, ...rest } = flat;
  return { ...rest, fontFamily: fontForWeight(fontWeight) };
}

export default function Text({ style, children, ...props }) {
  const nested = useContext(InsideText);
  const resolved = resolveFont(style, nested);
  const final = nested ? resolved : { color: colors.text, ...resolved };
  return (
    <InsideText.Provider value={true}>
      <RNText {...props} style={final}>
        {children}
      </RNText>
    </InsideText.Provider>
  );
}

export const TextInput = React.forwardRef(function TextInput(
  { style, ...props },
  ref
) {
  const flat = StyleSheet.flatten(style) || {};
  const { fontWeight, ...rest } = flat;
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={colors.textFaint}
      selectionColor={colors.primary}
      {...props}
      style={[
        { color: colors.text, fontFamily: fonts.regular, fontSize: 15 },
        rest,
        fontWeight ? { fontFamily: fontForWeight(fontWeight) } : null,
      ]}
    />
  );
});
