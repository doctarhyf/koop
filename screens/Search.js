import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  EmptyState,
  Input,
  ListSkeleton,
  PressableScale,
  Text,
} from "../components/ui";
import { colors, space, type } from "../theme";

import useFetch, { useFetch2 } from "../hooks/useFetch";
import { VILLES } from "../helpers/flow";

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
  const searchType = route.params;
  const { user, setuser } = useContext(UserContext);
  // const [searchType, setmode] = useState(searchType); //SEARCHING_MODE.SERVICE_REQUESTS);
  const [q, setq] = useState("");
  const [selected_tags, set_selected_tags] = useState([]);
  const [favedShops, setfavedShops] = useState([]);
  const [loadingItems, items, error, reload] = useFetch2(
    SEARCHING_MODE.SERVICE_REQUESTS === searchType
      ? "https://konext.vercel.app/api/sreq"
      : "https://konext.vercel.app/api/shops"
  );
  const tags =
    SEARCHING_MODE.SERVICE_REQUESTS === searchType ? VILLES : ["Favorites"];
  const [itemsf, setitemsf] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: SEARCHING_MODE.SHOPS === searchType ? "Boutiques" : "Annonces",
    });
  }, [navigation, searchType]);

  useEffect(() => {
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
    //alert(favedShops);
  }, [favedShops]);

  useEffect(() => {
    loadFavedShops();
  }, []);

  const loadFavedShops = async () => {
    let faved = await AsyncStorage.getItem("favedShops");

    if (faved === null) {
      faved = JSON.stringify([]);
      await AsyncStorage.setItem("favedShops", faved);
    }

    setfavedShops(JSON.parse(faved));
    // alert(`Loaded favedShops ${faved}`);
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
      if (searchType === SEARCHING_MODE.SERVICE_REQUESTS) {
        filteredBySelectedTags = items.filter((it) =>
          //if mode is shop -> change logic
          selected_tags.includes(it.user_data.ville)
        );
      } else if (searchType === SEARCHING_MODE.SHOPS) {
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
    if (searchType === SEARCHING_MODE.SERVICE_REQUESTS) {
      finalData = filteredBySelectedTags.filter((it) =>
        it.label.toLowerCase().includes(txt.toLowerCase())
      );
    } else if (searchType === SEARCHING_MODE.SHOPS) {
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

    if (searchType === SEARCHING_MODE.SERVICE_REQUESTS) {
      setitemsf(items.filter((it) => updatedTags.includes(it.user_data.ville)));
    } else if (searchType === SEARCHING_MODE.SHOPS) {
      if (updatedTags[0] === tags[0])
        setitemsf(items.filter((it) => favedShops.includes(it.id)));
    }
  };

  const renderItem = (data) =>
    searchType === SEARCHING_MODE.SERVICE_REQUESTS ? (
      <PressableScale
        scaleTo={0.985}
        onPress={() => navigation.navigate("ViewServiceRequest", data.item, { pop: true })}
      >
        <AnnonceItem
          item={data.item}
          itsMyItem={data.item?.user_data?.id === user.id}
          showProfile
        />
      </PressableScale>
    ) : (
      <ShopItem
        onFaveShop={onFaveShop}
        favedShops={favedShops}
        navigation={navigation}
        shop={data.item}
        itsMyItem={false}
      />
    );

  const keyExtractor = (item, i) => String(item?.id ?? i);
  const isShops = searchType === SEARCHING_MODE.SHOPS;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.xs }}>
        <Input
          icon="search"
          value={q}
          onChangeText={onSearch}
          placeholder={isShops ? "Rechercher une boutique…" : "Rechercher une annonce…"}
          returnKeyType="search"
          right={
            q.length > 0 ? (
              <PressableScale onPress={() => onSearch("")} scaleTo={0.85}>
                <Feather name="x-circle" size={18} color={colors.textFaint} />
              </PressableScale>
            ) : null
          }
        />
      </View>

      <TagsSelector onTagsUpdate={onTagsUpdate} data={tags} />

      {itemsf && itemsf.length > 0 && (
        <Text style={[type.caption, st.count]}>
          {itemsf.length} résultat{itemsf.length > 1 ? "s" : ""}
        </Text>
      )}

      {loadingItems && (!itemsf || itemsf.length === 0) ? (
        <View style={{ padding: space.lg }}>
          <ListSkeleton rows={5} />
        </View>
      ) : itemsf && itemsf.length > 0 ? (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxxl }}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={itemsf}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      ) : itemsf ? (
        <EmptyState
          icon="search"
          title="Aucun résultat"
          subtitle="Essayez un autre mot-clé ou retirez quelques filtres."
        />
      ) : null}
    </View>
  );
}

const st = StyleSheet.create({
  count: {
    color: colors.textMuted,
    paddingHorizontal: space.lg,
    paddingBottom: space.xs,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
