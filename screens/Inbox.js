import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import {
  View,
  TextView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../helpers/styles";
import useFetch from "../hooks/useFetch";
import { UserContext } from "../App";
import { FontAwesome } from "@expo/vector-icons";

const MESSAGE_TYPE = {
  INBOX: "inbox",
  OUTBOX: "outbox",
};

const MessageItem = ({
  userProfile,
  userName,
  messageContent,
  messageDate,
  handleMessagePress,
}) => (
  <TouchableOpacity onPress={handleMessagePress}>
    <View style={[st.messageContainer]}>
      <Image source={userProfile} style={st.profileImage} />
      <View style={st.messageContentContainer}>
        <Text style={st.messageDate}>{userName}</Text>
        <Text style={st.messageContent}>{messageContent}</Text>
        <Text style={st.messageDate}>{messageDate}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function Inbox({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [tabtype, settabtype] = useState(MESSAGE_TYPE.INBOX);
  const api = `https://konext.vercel.app/api/messages?id=${user.id}`;
  const [loading, messages, error] = useFetch(api);
  const nomsg = "You have no messages for now";
  const [inbox, setinbox] = useState([]);
  const [outbox, setoutbox] = useState([]);

  //alert(api);

  useEffect(() => {
    //alert(JSON.stringify(messages));
    if (messages) {
      setinbox(messages.inbox);
      setoutbox(messages.outbox);
    }
  }, [messages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : (
          <TouchableOpacity onPress={(e) => console.log(e)}>
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        ),
    });
  }, [navigation]);

  const handleMessagePress = (messageItem) => {
    navigation.navigate("ViewMessage", messageItem);
  };

  return loading ? (
    <View style={[styles.paddingLarge]}>
      <ActivityIndicator animating={loading} color={KOOP_BLUE} />
    </View>
  ) : (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.bgWhite]}>
        {[
          {
            label: "INBOX",
            type: MESSAGE_TYPE.INBOX,
          },
          {
            label: "OUTBOX",
            type: MESSAGE_TYPE.OUTBOX,
          },
        ].map((it, i) => (
          <TouchableOpacity key={i} onPress={(e) => settabtype(it.type)}>
            <View
              style={[
                styles.flexRow,
                styles.justifyCenter,
                styles.alignCenter,
                styles.paddingSmall,
                tabtype === it.type ? st.on : st.off,
              ]}
            >
              {i === 0 && (
                <MaterialCommunityIcons
                  name="email-receive"
                  size={24}
                  color={tabtype === it.type ? KOOP_BLUE : "#000"}
                />
              )}
              <Text
                style={[
                  styles.paddingSmall,
                  { color: tabtype === it.type ? KOOP_BLUE : "#000" },
                ]}
              >
                {it.label}
              </Text>
              {i === 1 && (
                <MaterialIcons
                  name="outbox"
                  size={24}
                  color={tabtype === it.type ? KOOP_BLUE : "#000"}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {!messages && (
        <Text style={[styles.textCenter, styles.paddingMid]}>{nomsg}</Text>
      )}

      {messages && (
        <View>
          {tabtype === MESSAGE_TYPE.INBOX ? (
            inbox.length === 0 ? (
              <Text style={[st.nomsg]}>No inbox messages</Text>
            ) : (
              <FlatList
                data={inbox}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <MessageItem
                    handleMessagePress={(e) => handleMessagePress(item)}
                    userName={`From: ${item.from_user.display_name}`}
                    userProfile={{ uri: item.from_user.profile }}
                    messageContent={item.message}
                    messageDate={item.created_at}
                  />
                )}
              />
            )
          ) : null}

          {
            tabtype === MESSAGE_TYPE.OUTBOX ? (
              outbox.length === 0 ? (
                <Text style={[st.nomsg]}>No outbox messages</Text>
              ) : (
                //outbox.map((msg, i) => (

                <FlatList
                  data={outbox}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <MessageItem
                      handleMessagePress={(e) => handleMessagePress(item)}
                      userName={`to: ${item.to_user.display_name}`}
                      userProfile={{ uri: item.to_user.profile }}
                      messageContent={item.message}
                      messageDate={item.created_at}
                    />
                  )}
                />
              )
            ) : null

            //))
          }
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  nomsg: {
    color: "grey",
    textAlign: "center",
    padding: 24,
  },
  on: {
    borderBottomWidth: 1,
    borderBottomColor: KOOP_BLUE,
    color: KOOP_BLUE,
  },
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContentContainer: {
    flex: 1,
  },
  messageContent: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});
