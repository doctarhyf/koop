import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../helpers/styles";
import { KOOP_BLUE } from "../helpers/colors";

export default function TagsSelector({ onTagsUpdate, data }) {
  const [tags, settags] = useState([]);

  const onTagPress = (item) => {
    if (tags.includes(item)) {
      const idx = tags.findIndex((i) => item === i);
      settags((prev) => prev.filter((it) => it !== item));
    } else {
      settags((prev) => [...prev, item]);
    }
  };

  useEffect(() => {
    onTagsUpdate(tags);
  }, [tags]);

  const renderItem = (item_data) => (
    <TouchableOpacity onPress={(e) => onTagPress(item_data.item)}>
      <Text style={[st.tag, tags.includes(item_data.item) && st.tag_sel]}>
        {item_data.item}
      </Text>
    </TouchableOpacity>
  );
  const keyExtractor = (item, i) => i;
  return (
    <View style={[styles.paddingSmall]}>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

const st = StyleSheet.create({
  tag: {
    backgroundColor: "#dddddd",
    padding: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  tag_sel: {
    backgroundColor: KOOP_BLUE,
    color: "white",
  },
});
