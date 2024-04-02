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
  Image,
  ActivityIndicator,
  Vibration,
} from "react-native";
import styles from "../helpers/styles";
import { KOOP_BLUE, KOOP_GREEN } from "../helpers/colors";
import * as API from "../utils/api";
import UserContext from "../context/UserContext";

export default function ViewMessage({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
  const contact_data = route.params;
  const contact = contact_data.item[1][0];
  let messages_data = contact_data.item[1];
  const [messages, setmessages] = useState(messages_data.slice(1));
  const [loading, setloading] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  //alert(JSON.stringify(contact_data));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: contact.shop_name + " " + contact.id,
      headerRight: () => (
        <TouchableOpacity onPress={(e) => console.log(e)}>
          <Image
            style={{
              width: 30,
              height: 30,
              marginRight: 4,
              borderRadius: 15,
              overflow: "hidden",
            }}
            source={{ uri: contact.profile }}
          />
        </TouchableOpacity>
      ),
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
    setloading(true);

    const res = await API.sendMessage({
      from_id: user.id,
      to_id: contact.id,
      content: newMessage,
    });

    Vibration.vibrate(250);
    setNewMessage("");

    const newMessages = [
      ...messages,
      {
        from_id: res.from_id,
        to_id: res.to_id,
        content: res.content,
        me: true,
      },
    ];
    setmessages(newMessages);

    setloading(false);
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

        <View style={[styles.flexRow, styles.paddingMid, { flex: 1 }]}>
          <TextInput
            style={[styles.txtInput, { flex: 1 }]}
            placeholder="Type your message ..."
            value={newMessage}
            onChangeText={(txt) => setNewMessage(txt)}
          />

          {loading ? (
            <ActivityIndicator animating={loading} color={KOOP_BLUE} />
          ) : (
            <TouchableOpacity
              onPress={(e) => newMessage.trim().length > 0 && onSendMessage()}
            >
              <View
                style={[
                  {
                    justifyContent: "center",
                    alignItems: "center",

                    flexGrow: 1,
                    paddingHorizontal: 8,
                  },
                ]}
              >
                <Text>SEND</Text>
              </View>
            </TouchableOpacity>
          )}
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
