import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KOOP_BLUE } from "../helpers/colors";

export const RadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 12,
            marginBottom: 12,
          }}
          onPress={() => onSelect(option.value)}
        >
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: option.value === selectedOption ? KOOP_BLUE : "gray",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {option.value === selectedOption && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: KOOP_BLUE,
                }}
              />
            )}
          </View>
          <Text
            style={{
              marginLeft: 10,
              color: option.value === selectedOption ? KOOP_BLUE : "#000",
            }}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
