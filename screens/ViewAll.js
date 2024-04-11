import React, { useEffect, useLayoutEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useFetch2 } from "../hooks/useFetch";
import styles from "../helpers/styles";

const ITEMS_TYPE = {
  ANNOUNCES: {
    id: "koop_sreqs",
    api: "https://konext.vercel.app/api/sreq",
  },
  SHOPS: {
    id: "koop_shops",
    api: "https://konext.vercel.app/api/shops",
  },
};

export default function ViewAll({ route, navigation }) {
  const type = route.params;
  const [loading, data, error, reload] = useFetch2(
    "https://konext.vercel.app/api/sreq"
  );

  useEffect(() => {
    let apiPath = ITEMS_TYPE.ANNOUNCES.api;
    if (ITEMS_TYPE.SHOPS.id === type) {
      apiPath = ITEMS_TYPE.SHOPS.api;
    }

    alert(apiPath);
    reload(apiPath);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type,
    });
  }, [navigation]);

  const keyExtractor = (item) => Math.random();

  const renderItem = (item) => <Text>{Math.random()}</Text>;

  return loading ? (
    <View style={[styles.flex1, styles.alignCenter, styles.justifyCenter]}>
      <ActivityIndicator animating={true} style={[styles.paddingLarge]} />
    </View>
  ) : (
    <View>
      {error && <Text>Error</Text>}
      {data && (
        <FlatList
          refreshing={loading}
          refreshControl={<RefreshControl onRefresh={(e) => reload()} />}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
