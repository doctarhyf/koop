import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  onTagPress,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import useFetch from "../hooks/useFetch";
import { VILLES } from "../helpers/flow";
import { ParseCreatedAt } from "../helpers/funcs";
import TagsSelector from "../components/TagsSelector";
import AnnonceItem from "../components/AnnonceItem";

export default function Search({ navigation }) {
  const [q, setq] = useState("");
  const [selected_tags, set_selected_tags] = useState([]);
  const [loadingItems, items, error] = useFetch(
    "https://konext.vercel.app/api/sreq"
  );
  const [itemsf, setitemsf] = useState(null);

  useEffect(() => {
    if (items && items.map) {
      setitemsf([...items]);
    }
  }, [items]);

  const onSearch = (txt) => {
    setq(txt);

    if (txt.trim() === "") {
      setitemsf(
        items.filter((it) => selected_tags.includes(it.user_data.ville))
      );
      return;
    }

    setitemsf(
      items.filter(
        (it) =>
          selected_tags.includes(it.user_data.ville) &&
          it.label.toLowerCase().includes(txt.toLowerCase())
      )
    );
  };

  const onTagsUpdate = (tags) => {
    console.error(tags);
    set_selected_tags(tags);
    if (tags.length === 0) {
      setitemsf(items);
      return;
    }
    setitemsf(items.filter((it) => tags.includes(it.user_data.ville)));
  };

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={(e) => navigation.navigate("ViewServiceRequest", item.item)}
    >
      <AnnonceItem item={item.item} showProfile />
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.index;

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={[styles.ti, { marginHorizontal: 18, marginTop: 18 }]}
        value={q}
        onChangeText={onSearch}
        placeholder="Search ..."
      />

      <TagsSelector onTagsUpdate={onTagsUpdate} data={VILLES} />

      <ActivityIndicator animating={loadingItems} color={KOOP_BLUE} />

      <FlatList
        style={[{ margin: 12, flex: 1 }]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={itemsf}
      />
    </View>
  );
}
