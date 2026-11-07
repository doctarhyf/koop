import { Alert, View } from "react-native";
import React, { useState } from "react";
import { space } from "../theme";
import { Button, Input } from "./ui";
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
    <View style={{ gap: space.sm }}>
      <Input
        value={comment}
        onChangeText={(txt) => setcomment(txt)}
        multiline
        icon="edit-3"
        placeholder="Partagez votre avis…"
      />
      <Button
        title="Publier le commentaire"
        icon="send"
        variant="dark"
        loading={loading}
        onPress={sendComment}
      />
    </View>
  );
}
