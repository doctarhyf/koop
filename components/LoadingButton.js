import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styles from "../helpers/styles";

import { KOOP_BLUE } from "../helpers/colors";

export default function LoadingButton({ handlePress, loading, text, icon }) {
  return (
    <View
      style={[styles.justifyCenter, styles.alignCenter, { marginVertical: 12 }]}
    >
      {loading ? (
        <ActivityIndicator size={32} animating={true} color={KOOP_BLUE} />
      ) : (
        <TouchableOpacity
          onPress={handlePress}
          style={[styles.alignCenter, icon ? styles.flexRow : null, { gap: 8 }]}
        >
          {icon}
          <Text style={[styles.textBlue, styles.textCenter]}>{text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
