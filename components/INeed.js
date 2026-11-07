import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { gradients, radius, space, type } from "../theme";
import { Badge, Text } from "./ui";

const professions = [
  "un médecin",
  "un maçon",
  "un ingénieur",
  "un électricien",
  "une voiture",
  "un programmeur",
  "un traiteur",
  "une carte Arduino",
  "un MacBook",
  "un iPhone 15",
];

// Rotating headline that hints at what people post on KOOP.
export default function INeed() {
  const [i, setI] = useState(0);
  const a = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => {
      Animated.timing(a, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        setI((v) => (v + 1) % professions.length);
        Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }).start();
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <LinearGradient colors={gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.card}>
      <Badge label="Je cherche · Je vends · Je fais" tone="glass" />
      <View style={{ height: 40, justifyContent: "center" }}>
        <Animated.View
          style={{
            opacity: a,
            transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
          }}
        >
          <Text style={[type.h2, { color: "#fff" }]}>
            {professions[i]}
            <Text style={{ color: "#7BC6F0" }}>…</Text>
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const st = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, gap: space.sm },
});
