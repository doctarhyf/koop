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
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import useFetch from "../hooks/useFetch";

function Tag({ label = "My tag" }) {
  return (
    <TouchableOpacity onPress={(e) => onTagPress}>
      <View style={[styles.flexRow, st.tag]}>
        <Text>{label}</Text>
        <View style={[{ width: 10 }]}></View>
        <Icon name={"times"} size={18} style={{ color: "white" }} />
      </View>
    </TouchableOpacity>
  );
}

export default function Search({ navigation }) {
  const [q, setq] = useState("");
  const [loadingItems, items, error] = useFetch(
    "https://konext.vercel.app/api/items"
  );
  const [itemsf, setitemsf] = useState(null);

  const onTagPress = (e) => {
    console.log(e);
  };

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
        it.name.toLowerCase().includes(txt.toLowerCase()) ||
        (it.desc && it.desc.toLowerCase().includes(txt.toLowerCase()))
    );
    setitemsf(f);
  };

  return (
    <View>
      <TextInput
        style={[styles.ti, { marginHorizontal: 18, marginTop: 18 }]}
        value={q}
        onChangeText={onSearch}
        placeholder="Search ..."
      />
      <ScrollView
        horizontal
        style={[styles.paddingSmall, { paddingRight: 12 }]}
      >
        {[...Array(15)].map((it, i) => (
          <Tag key={i} label={`My Tag${i}`} onTagPress={onTagPress} />
        ))}
      </ScrollView>

      <ActivityIndicator animating={loadingItems} color={KOOP_BLUE} />
      <ScrollView>
        {itemsf &&
          itemsf.map &&
          itemsf.map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("ServiceInfo", it)}
            >
              <View style={[styles.flexRow, styles.paddingSmall]}>
                <Image
                  style={[{ width: 62, height: 62 }, styles.marginRight]}
                  source={it.photos[0]}
                  transition={1000}
                />
                <View>
                  <Text>{it.name}</Text>
                  {it.desc && (
                    <Text numberOfLines={2} style={[styles.textGray]}>
                      {it.desc}
                    </Text>
                  )}
                  <Text style={[{ fontSize: 12 }, styles.textGray]}>
                    {it.created_at}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  tag: {
    backgroundColor: "lightgrey",
    borderRadius: 12,
    marginHorizontal: 4,
    padding: 4,
    paddingHorizontal: 10,
  },
});
