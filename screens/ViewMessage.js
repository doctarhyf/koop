import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
} from "react-native";
import styles from "../helpers/styles";
import { KOOP_GREEN } from "../helpers/colors";
import * as API from "../utils/api";
import { UserContext } from "../App";

export default function ViewMessage({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
  const contact_data = route.params;
  const contact = contact_data.item[1][0];
  let messages_data = contact_data.item[1];
  const [messages, setmessages] = useState(messages_data.slice(1));

  const [newMessage, setNewMessage] = useState("");

  //alert(JSON.stringify(contact_data));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: contact.shop_name + " " + contact.id,
    });

    //set_contact_data(route.params);
  }, [route]);

  const onRenderMessage = (message) => {
    message = message.item;
    const { id, content, created_at, me } = message;
    return (
      <View style={[]}>
        <View style={[{ flexDirection: me ? "row-reverse" : "row" }]}>
          <Text style={[st.msg, { backgroundColor: me ? KOOP_GREEN : "#ddd" }]}>
            {content}
          </Text>
          <Text style={[{ flexGrow: 1 }]}></Text>
        </View>
      </View>
    );
  };

  const onSendMessage = async () => {
    //alert(JSON.stringify(route.params));

    const msgObj = {
      content: newMessage,
      me: true,
    };

    const newMessages = [...messages, msgObj];
    setmessages(newMessages);

    const res = await API.sendMessage({
      from_id: user.id,
      to_id: contact.id,
      content: newMessage,
    });

    alert(JSON.stringify(res));
  };

  return (
    <ScrollView>
      <View style={[{ padding: 8 }]}>
        {messages.length === 0 && (
          <Text style={[styles.textCenter, styles.paddingLarge]}>
            No Messages
          </Text>
        )}

        {messages.length > 0 && (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={onRenderMessage}
          />
        )}

        <View style={[styles.flexRow, styles.paddingMid]}>
          <TextInput
            style={[styles.ti, { padding: 8, flexGrow: 1 }]}
            placeholder="Type your message ..."
            value={newMessage}
            onChangeText={(txt) => setNewMessage(txt)}
          />

          <TouchableOpacity onPress={onSendMessage}>
            <Text>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  msg: {
    margin: 4,
    flexShrink: 1,
    padding: 8,
    paddingVertical: 12,
    backgroundColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
  },
});
