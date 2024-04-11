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

    if (txt === "") {
      setitemsf([...items]);
    }

    const f = items.filter(
      (it, i) =>
        it.label.toLowerCase().includes(txt.toLowerCase()) ||
        (it.desc && it.desc.toLowerCase().includes(txt.toLowerCase()))
    );
    setitemsf(f);
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

  return (
    <View>
      <TextInput
        style={[styles.ti, { marginHorizontal: 18, marginTop: 18 }]}
        value={q}
        onChangeText={onSearch}
        placeholder="Search ..."
      />

      <TagsSelector onTagsUpdate={onTagsUpdate} data={VILLES} />

      <ActivityIndicator animating={loadingItems} color={KOOP_BLUE} />
      <ScrollView>
        {itemsf &&
          itemsf.map &&
          itemsf.map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("ViewServiceRequest", it)}
            >
              <View style={[styles.flexRow, styles.paddingSmall]}>
                <Image
                  style={[{ width: 62, height: 62 }, styles.marginRight]}
                  source={"" || it.user_data.profile}
                  transition={1000}
                />
                <View>
                  <Text>{it.label}</Text>
                  {it.desc && (
                    <Text numberOfLines={2} style={[styles.textGray]}>
                      {it.desc}
                    </Text>
                  )}
                  <Text>{it.user_data.ville}</Text>
                  <Text style={[{ fontSize: 12 }, styles.textGray]}>
                    {ParseCreatedAt(it.created_at).full}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
