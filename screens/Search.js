import React, { useContext, useEffect, useState } from "react";
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
import UserContext from "../context/UserContext";
import ShopItem from "../components/ShopItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCHING_MODE = {
  SHOPS: "koop_shops",
  SERVICE_REQUESTS: "koop_sreqs",
};

export default function Search({ navigation, route }) {
  const type = route.params;
  const { user, setuser } = useContext(UserContext);
  const [mode, setmode] = useState(SEARCHING_MODE.SERVICE_REQUESTS);
  const [q, setq] = useState("");
  const [selected_tags, set_selected_tags] = useState([]);
  const [favedShops, setfavedShops] = useState([]);
  const [loadingItems, items, error] = useFetch(
    SEARCHING_MODE.SERVICE_REQUESTS === type
      ? "https://konext.vercel.app/api/sreq"
      : "https://konext.vercel.app/api/shops"
  );
  const tags =
    SEARCHING_MODE.SERVICE_REQUESTS === type ? VILLES : ["Favorites"];
  const [itemsf, setitemsf] = useState(null);

  useEffect(() => {
    loadFavedShops();
    if (items && items.map) {
      setitemsf([...items]);
    }
  }, [items]);

  useEffect(() => {
    //alert(favedShops);
    async function updateFaved() {
      await AsyncStorage.setItem("favedShops", JSON.stringify(favedShops));
      onTagsUpdate(favedShops);
    }
    updateFaved();
  }, [favedShops]);

  const loadFavedShops = async () => {
    let faved = await AsyncStorage.getItem("favedShops");

    if (faved === null) {
      faved = JSON.stringify([]);
      await AsyncStorage.setItem("favedShops", faved);
    }

    setfavedShops(JSON.parse(faved));
  };

  const onFaveShop = async (id) => {
    const isFaved = favedShops.includes(id);

    if (isFaved) {
      setfavedShops((prev) => prev.filter((it) => it !== id));
    } else {
      setfavedShops((prev) => [...prev, id]);
    }
  };

  const onSearch = (txt) => {
    setq(txt);

    const emptySearch = txt.trim() === "";
    const tagsAreSelected = selected_tags.length > 0;
    let filteredBySelectedTags = [...items];

    if (tagsAreSelected) {
      if (type === SEARCHING_MODE.SERVICE_REQUESTS) {
        filteredBySelectedTags = items.filter((it) =>
          //if mode is shop -> change logic
          selected_tags.includes(it.user_data.ville)
        );
      } else if (type === SEARCHING_MODE.SHOPS) {
        filteredBySelectedTags = items.filter(
          (it) => favedShops.includes(it.id)
          //selected_tags.includes(it.ville)
        );
      }
    }

    if (emptySearch) {
      setitemsf([...filteredBySelectedTags]);
      return;
    }

    //perform search ...
    let finalData = [];
    if (type === SEARCHING_MODE.SERVICE_REQUESTS) {
      finalData = filteredBySelectedTags.filter((it) =>
        it.label.toLowerCase().includes(txt.toLowerCase())
      );
    } else if (type === SEARCHING_MODE.SHOPS) {
      finalData = filteredBySelectedTags.filter((it) =>
        it.shop_name.toLowerCase().includes(txt.toLowerCase())
      );
    }
    setitemsf(finalData);
  };

  const onTagsUpdate = (updatedTags) => {
    //console.error(tags);
    set_selected_tags(updatedTags);
    if (updatedTags.length === 0) {
      setitemsf(items);
      return;
    }

    if (type === SEARCHING_MODE.SERVICE_REQUESTS) {
      setitemsf(items.filter((it) => updatedTags.includes(it.user_data.ville)));
    } else if (type === SEARCHING_MODE.SHOPS) {
      if (updatedTags[0] === tags[0])
        setitemsf(items.filter((it) => favedShops.includes(it.id)));
    }
  };

  const renderItem = (data) =>
    type === SEARCHING_MODE.SERVICE_REQUESTS ? (
      <TouchableOpacity
        onPress={(e) => navigation.navigate("ViewServiceRequest", data.item)}
      >
        <AnnonceItem
          item={data.item}
          itsMyItem={data.item.user_data.id === user.id}
          showProfile
        />
      </TouchableOpacity>
    ) : (
      <ShopItem
        onFaveShop={onFaveShop}
        favedShops={favedShops}
        navigation={navigation}
        shop={data.item}
        itsMyItem={false} //data.item.user_data.id === user.id}
      />
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

      <TagsSelector onTagsUpdate={onTagsUpdate} data={tags} />

      {loadingItems && (
        <ActivityIndicator animating={loadingItems} color={KOOP_BLUE} />
      )}

      {itemsf && itemsf.length > 0 && (
        <FlatList
          style={[{ margin: 12, flex: 1 }]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={itemsf}
        />
      )}

      {itemsf && itemsf.length === 0 && (
        <Text style={[styles.textCenter, styles.paddingLarge]}>
          No items found
        </Text>
      )}
    </View>
  );
}
