import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";

const professions = [
  "Médecin",
  "Un macon",
  "Ingénieur",
  "Un electricien",
  "Une vehicule a acheter",
  "Programmeur",
  "Un service traiteur",
  "Une plaquette arduino",
  "un MacBook",
  "un iPhone 15",
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return "#ffffff"; //color;
};

const invertColor = (hexColor) => {
  return (
    "#" +
    (0xffffff - parseInt(hexColor.replace("#", ""), 16))
      .toString(16)
      .padStart(6, "0")
  );
};

const RandomProfessionComponent = () => {
  const [randomProfession, setRandomProfession] = useState("");
  const [textColor, setTextColor] = useState(getRandomColor());
  const [backgroundColor, setBackgroundColor] = useState(
    invertColor(textColor)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * professions.length);
      const color = getRandomColor();
      setRandomProfession(professions[randomIndex]);
      setTextColor(color);
      setBackgroundColor(invertColor(color));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
        padding: 12,
      }}
    >
      <Text style={{ fontSize: 24, color: textColor }}>
        {randomProfession} ...
      </Text>
    </View>
  );
};

export default function INeed() {
  return (
    <View>
      <Text
        style={[
          {
            fontSize: 28,
            textAlign: "center",
            marginVertical: 18,
            fontWeight: "bold",
          },
        ]}
      >
        J'ai besoin de/Je suis/Je cherche ...
      </Text>
      <RandomProfessionComponent />
    </View>
  );
}
