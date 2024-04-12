import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import SimpleTextButton from "./SimpleTextButton";
import LoadingButton from "./LoadingButton";
import styles from "../helpers/styles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
//import Clipboard from "@react-native-clipboard/clipboard";

const MAX_LINKS = 3;
export default function LinksBox({ onLinksAdd }) {
  const [links, setlinks] = useState([]);
  const [link, setlink] = useState("https://");

  const httpsUrlPattern = /^https:\/\/(?:\w+\.)?\w+\.\w+(?:\/\S*)?$/;

  function isValidHttpsUrl(url) {
    return httpsUrlPattern.test(url);
  }

  const handleAddNewLink = (e) => {
    if (!isValidHttpsUrl(link)) {
      alert(`Link "${link}" is not a valid https:// link!`);
      return;
    }

    if (links.length === MAX_LINKS) {
      alert(`Maximum ${MAX_LINKS} can be shared!`);
      return;
    }

    setlinks((prev) => [...prev, link]);
    setlink("");
  };

  useEffect(() => {
    if (links && links.length > 0) {
      onLinksAdd(links.join(";"));
    }
  }, [links]);

  const removeLink = (idx) => {
    Alert.alert(
      "Delete link",
      "Are you sure you wanna delete this link? No undo",
      [
        {
          text: "Cancel",
        },
        {
          text: "DELETE",
          style: "destructive",
          onPress: () => {
            const new_links = [...links];
            new_links.splice(idx, 1);
            setlinks(new_links);
          },
        },
      ]
    );
  };

  const onPastLink = async () => {
    /* const text = await Clipboard.getString();
    setlink(text); */
  };

  return (
    <View>
      {links.length < MAX_LINKS && (
        <View>
          <TextInput
            style={[styles.ti, styles.paddingSmall]}
            value={link}
            placeholder="Ajouter un lien"
            onChangeText={(txt) => setlink(txt)}
          />

          {/*  <TouchableOpacity onPress={(e) => onPastLink()}>
            <FontAwesome5
              style={[{ padding: 8 }]}
              name="paste"
              size={24}
              color="black"
            />
          </TouchableOpacity> */}
        </View>
      )}
      {links.length > 0 && (
        <View>
          {links.map((lk, i) => (
            <View style={[styles.flexRow, styles.alignCenter, { gap: 8 }]}>
              <Text>{i + 1}.</Text>
              <Text numberOfLines={1} style={[{ flex: 1, fontWeight: "bold" }]}>
                {lk}
              </Text>
              <TouchableOpacity onPress={(e) => removeLink(i)}>
                <MaterialIcons
                  style={[{ padding: 8 }]}
                  name="delete"
                  size={28}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {links.length < MAX_LINKS && (
        <SimpleTextButton
          text={"+ AJOUTER UN LIEN"}
          handlePress={handleAddNewLink}
        />
      )}
    </View>
  );
}
