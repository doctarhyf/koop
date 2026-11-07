import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { space } from "../theme";
import { Chip } from "./ui";

export default function TagsSelector({ onTagsUpdate, data }) {
  const [tags, settags] = useState([]);

  const onTagPress = (item) => {
    settags((prev) =>
      prev.includes(item) ? prev.filter((it) => it !== item) : [...prev, item]
    );
  };

  useEffect(() => {
    onTagsUpdate(tags);
  }, [tags]);

  return (
    <View style={{ paddingVertical: space.sm }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.xs }}
        keyExtractor={(item, i) => `${i}-${item}`}
        renderItem={({ item }) => (
          <Chip
            label={item}
            icon={item === "Favorites" ? "heart" : "map-pin"}
            selected={tags.includes(item)}
            onPress={() => onTagPress(item)}
          />
        )}
      />
    </View>
  );
}
