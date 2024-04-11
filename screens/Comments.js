import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFetch2 } from "../hooks/useFetch";
import { Image } from "expo-image";

export default function Comments({ route, navigation }) {
  const { item_id, item_type } = route.params;
  const apiPath = `https://konext.vercel.app/api/comments?item_id=${item_id}&item_type=${item_type}`;
  const [loading, comments, error, reload] = useFetch2(apiPath);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Comments (${(comments && comments.length) || 0})`,
    });
  }, [route, comments]);

  const keyExtractor = (item) => item.id;

  const renderItem = (comment) => (
    <View
      style={[
        st.cmt_cont,
        {
          borderBottomWidth: 1,
          borderBottomColor: "#dddddd",
          paddingVertical: 8,
        },
      ]}
    >
      <Image
        transition={1000}
        source={comment.item.user_data.profile || require("../assets/rhyf.png")}
        style={[{ width: 60, height: 60, borderRadius: 30 }]}
      />
      <View style={[{ flex: 1 }]}>
        <Text style={[{ color: "#666666" }]}>
          {comment.item.user_data.display_name}
        </Text>
        <Text style={[{ fontWeight: "bold", fontSize: 16, flex: 1 }]}>
          {comment.item.comment}
        </Text>
        <Text style={[{ color: "#aaaaaa" }]}>{comment.item.timeAgo}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={[{ padding: 12 }]}
      data={comments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

const st = StyleSheet.create({
  cmt_cont: {
    flexDirection: "row",
    gap: 8,
  },
});
