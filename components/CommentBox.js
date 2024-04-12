import { View, Text, TextInput, Alert } from "react-native";
import React, { useContext, useState } from "react";
import styles from "../helpers/styles";
import LoadingButton from "./LoadingButton";
import { FontAwesome } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import UserContext from "../context/UserContext";
import * as API from "../utils/api";

export default function CommentBox({
  posted_by_id,
  item_id,
  item_type = "sreq",
  navigation,
}) {
  const [comment, setcomment] = useState("");

  const [loading, setloading] = useState(false);

  const sendComment = async (e) => {
    if (comment.trim() === "") {
      Alert.alert("Empty comment", "Write something to post please ...");
      return;
    }

    setloading(true);

    const commentBody = {
      item_id: item_id,
      posted_by_id: posted_by_id,
      comment: comment,
      item_type: item_type,
    };

    const r = await API.postComment(commentBody);

    if (r[0] && r[0].id) {
      setcomment("");
      Alert.alert("Comment posted", "The comment has been posted", [
        {
          text: "OK",
          onPress: () =>
            navigation.replace("Comments", {
              item_id: commentBody.item_id,
              item_type: commentBody.item_type,
            }),
        },
      ]);
    } else {
      Alert.alert("Comment post error", JSON.stringify(r));
    }
    setloading(false);
  };
  return (
    <View>
      <TextInput
        value={comment}
        onChangeText={(txt) => setcomment(txt)}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={[styles.ti, { padding: 12 }]}
        placeholder="Laisser un commentaire ..."
      />
      <LoadingButton
        loading={loading}
        text={"ENVOYER COMMENTAIRE"}
        handlePress={sendComment}
        icon={<FontAwesome name="send" size={24} color={KOOP_BLUE} />}
      />
    </View>
  );
}
