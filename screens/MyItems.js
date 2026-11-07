import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Image } from "expo-image";
import AnnonceItem from "../components/AnnonceItem";
import {
  EmptyState,
  IconButton,
  ListSkeleton,
  PressableScale,
  Text,
} from "../components/ui";
import { useFetch2 } from "../hooks/useFetch";
import UserContext from "../context/UserContext";
import { ParseCreatedAt } from "../helpers/funcs";
import { colors, radius, shadows, space, type } from "../theme";

const TAB = {
  MY_ITEMS: 0,
  MY_SERVICES_REQUESTS: 1,
};

export default function MyItems({ navigation, route }) {
  let { user, setuser } = useContext(UserContext);
  const viewingOtherShopID = route.params;

  let id = user.id;
  if (viewingOtherShopID && viewingOtherShopID !== user.id) {
    id = viewingOtherShopID;
  }

  const END_POINT_MY_SERVICES_REQUESTS = `https://konext.vercel.app/api/sreq?user_id=${id}`;
  const END_POINT_MY_ITEMS = `https://konext.vercel.app/api/items?user_id=${id}`;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTabID, setSelectedTabID] = useState(TAB.MY_SERVICES_REQUESTS);
  const [loadingdata, itemsdata, errordata, reloaddata] = useFetch2(
    END_POINT_MY_SERVICES_REQUESTS
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${viewingOtherShopID ? "" : "Mes "}Annonces`,

      headerRight: () =>
        loadingdata ? (
          <ActivityIndicator animating={loadingdata} color={colors.primary} />
        ) : (
          <IconButton
            name="plus"
            size={36}
            bg={colors.ink}
            color="#fff"
            border={false}
            onPress={() => {
              if (selectedTabID === TAB.MY_ITEMS) {
                navigation.navigate("Provide", undefined, { pop: true });
              } else {
                navigation.navigate("ServiceRequest", undefined, { pop: true });
              }
            }}
          />
        ),
    });
  }, [route, loadingdata]);

  const onRefresh = () => {
    reloaddata();
  };

  useEffect(() => {
    const api =
      selectedTabID === TAB.MY_ITEMS
        ? END_POINT_MY_ITEMS
        : END_POINT_MY_SERVICES_REQUESTS;
    reloaddata(api);

    console.error("Reloading api ... ", api);
  }, [selectedTabID]);

  const extractKey = (item, i) => String(item?.id ?? i);

  const handleAnnouncePress = (item) => {
    //Alert.alert(item.label, item.desc);
    if (viewingOtherShopID && viewingOtherShopID !== user.id) {
      item.other = true;
    }
    navigation.push("ViewServiceRequest", item);
  };

  const handleItemMyLongPress = (item) => {
    Alert.alert("Delete item?", "This action is not reversible", [
      {
        text: "NO",
      },
      {
        text: "DELETE",
        style: "destructive",
      },
    ]);
  };

  const onAnnonceLongPress = (item) => {
    Alert.alert("Delete item?", "This action is not reversible", [
      {
        text: "NO",
      },
      {
        text: "DELETE",
        style: "destructive",
      },
    ]);
  };

  const renderItem = (item) => {
    const { id, label, created_at } = item.item; //service request
    const { name, desc, photos } = item.item; //service or product

    let date = "";
    const dateData = ParseCreatedAt(created_at);

    if (dateData) {
      date = dateData.full;
    }

    return selectedTabID === TAB.MY_SERVICES_REQUESTS ? (
      <PressableScale
        scaleTo={0.985}
        onPress={() => handleAnnouncePress(item.item)}
        onLongPress={() => onAnnonceLongPress(item.item)}
      >
        <AnnonceItem item={item.item} itsMyItem={!viewingOtherShopID || viewingOtherShopID === user.id} />
      </PressableScale>
    ) : (
      <PressableScale
        scaleTo={0.985}
        onPress={() => navigation.navigate("ServiceInfo", item.item, { pop: true })}
        onLongPress={handleItemMyLongPress}
        style={[st.prod, shadows.xs]}
      >
        <Image
          transition={300}
          source={photos ? photos[0] : require("../assets/rhyf.png")}
          style={st.prodImg}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={[type.title, { flex: 1 }]} numberOfLines={1}>{name}</Text>
            <Text style={[type.caption, { color: colors.textFaint }]}>{date}</Text>
          </View>
          <Text numberOfLines={2} style={[type.small, { color: colors.textMuted }]}>{desc}</Text>
        </View>
      </PressableScale>
    );
  };

  const isEmpty = !loadingdata && Array.isArray(itemsdata) && itemsdata.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {loadingdata && (!itemsdata || itemsdata.length === 0) ? (
        <View style={{ padding: space.lg }}>
          <ListSkeleton rows={5} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            { padding: space.lg, paddingBottom: space.xxxl },
            isEmpty && { flex: 1, justifyContent: "center" },
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          data={itemsdata}
          keyExtractor={extractKey}
          renderItem={renderItem}
          ListEmptyComponent={
            errordata ? (
              <EmptyState icon="wifi-off" title="Connexion impossible" subtitle="Tirez pour réessayer." />
            ) : (
              <EmptyState
                icon="layers"
                title="Aucune annonce"
                subtitle={viewingOtherShopID ? "Cette boutique n'a encore rien publié." : "Publiez votre première annonce en quelques secondes."}
                action={viewingOtherShopID ? undefined : "Nouvelle annonce"}
                onAction={() => navigation.navigate("ServiceRequest", undefined, { pop: true })}
              />
            )
          }
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  prod: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.sm,
    marginBottom: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  prodImg: { width: 64, height: 64, borderRadius: radius.md },
});
