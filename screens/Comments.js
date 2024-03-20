import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import styles from "../helpers/styles";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import { KOOP_BLUE } from "../helpers/colors";
import { loadAllItems, loadItem } from "../utils/db";

export default function Comments({ route, navigation }) {
  const { params } = route;
  const item = params;
  const [loading, setloading] = useState(false);
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      try {
        const response = await fetch(
          `https://konext.vercel.app/api/comments?id=${item.id}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setcomments(data);
        setloading(false);
        console.log("Data fetched successfully:", data);
        // Handle the fetched data
      } catch (error) {
        setloading(false);
        console.error("There was a problem with the request:", error);
        // Handle errors
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={[{ padding: 12 }]}>
      {loading && <ActivityIndicator animating={loading} color={KOOP_BLUE} />}
      {comments.length === 0 && !loading && (
        <Text style={[styles.textCenter]}>No comments for now</Text>
      )}
      {/*  {errorLoadingComments && (
        <Text style={[styles.textCenter]}>Error loading comments</Text>
      )} */}
      {!loading &&
        comments.length > 0 &&
        comments.map((comment, i) => (
          <View key={i} style={[st.comment]}>
            <View
              style={[
                styles.flexRow,
                styles.alignCenter,
                styles.justifyBetween,
              ]}
            >
              <Image
                source={
                  { uri: comment.posted_by_profile } ||
                  require("../assets/rhyf.png")
                }
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    overflow: "hidden",
                  },
                ]}
              />
              <Text>{comment.posted_by_display_name}</Text>
            </View>
            <Text>{comment.comment}</Text>
            <Text style={[styles.textGray, styles.marginTopSmall]}>
              {new Date().toString()}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
});
