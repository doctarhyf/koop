import React, { useLayoutEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useFetch2 } from "../hooks/useFetch";

export default function ViewAll({ route, navigation }) {
  const type = route.params;
  const [loading, data, error, reload] = useFetch2(
    "https://konext.vercel.app/api/sreq"
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type,
    });
  }, [navigation]);

  return (
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
