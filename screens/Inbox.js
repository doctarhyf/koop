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

/* const MessageItem = ({
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
); */

const ContactItem = ({ contactProfile, contactName, lastMessage }) => {
  return (
    <View style={[st.contactContainer, styles.flex1]}>
      <Image source={require("../assets/rhyf.png")} style={st.contactProfile} />
      <View style={[{ flexGrow: 1 }]}>
        <View
          style={[
            {
              justifyContent: "space-between",
              flexDirection: "row",
              flexGrow: 1,
              flex: 1,
            },
          ]}
        >
          <Text numberOfLines={1} style={[{ fontWeight: "bold" }]}>
            Contact Name
          </Text>
          <Text numberOfLines={1} style={[styles.textGray]}>
            Last date
          </Text>
        </View>
        <Text style={[styles.textGray]}>Previw last message ...</Text>
      </View>
    </View>
  );
};

export default function Inbox({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const api = `https://konext.vercel.app/api/messages?user_id=${user.id}&page=1&count=10`;
  const [loading, messages, error] = useFetch(api);
  const nomsg = "You have no messages for now";

  //alert(api);
  useEffect(() => {
    alert(JSON.stringify(messages));
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

  return (
    <View>
      {<ActivityIndicator animating={loading} color={KOOP_BLUE} />}
      {((messages && messages.length === 0) || messages === undefined) && (
        <Text style={[styles.textCenter, styles.paddingLarge]}>
          No messages
        </Text>
      )}
      {messages && messages.length > 0 && (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ContactItem />}
        />
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
  contactContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactProfile: {
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
