import React from "react";
import { View } from "react-native";
import { Button } from "./ui";

// Legacy API kept for existing screens; renders the design-system Button.
export default function LoadingButton({ handlePress, loading, text, variant = "primary" }) {
  return (
    <View style={{ marginVertical: 12 }}>
      <Button title={text} onPress={handlePress} loading={loading} variant={variant} />
    </View>
  );
}
