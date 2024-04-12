import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SimpleTextButton from "./SimpleTextButton";
import LoadingButton from "./LoadingButton";
import styles from "../helpers/styles";
import { MaterialIcons } from "@expo/vector-icons";

export default function LinksBox() {
  const [links, setlinks] = useState([""]);

  return (
    <View>
      <SimpleTextButton
        text={"+ AJOUTER UN LIEN"}
        handlePress={(e) => setlinks((prev) => [...prev, ""])}
      />
    </View>
  );
}
