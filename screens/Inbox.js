import React, {
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  View,
  TextView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../helpers/styles";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/UserContext";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MESSAGE_TYPE = {
  INBOX: "inbox",
  OUTBOX: "outbox",
};

const ContactItem = ({ contact_data, handleContactPress }) => {
  const contact = contact_data.item[1][0];

  if (contact === null) return null;

  const last_message = contact_data.item[1][contact_data.item[1].length - 1];
  const { shop_name, profile } = contact;
  const last_date = new Date(last_message.created_at).toISOString().split("T");
  const last_message_date = `${last_date[0]}`;

  return (
    <TouchableOpacity onPress={(e) => handleContactPress(contact_data)}>
      <View style={[st.contactContainer, styles.flex1]}>
        <Image source={{ uri: profile }} style={st.contactProfile} />
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
              {shop_name}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.textGray,
                {
                  flexGrow: 1,
                  textAlign: "right",
                },
              ]}
            >
              {last_message_date}
            </Text>
          </View>
          <Text numberOfLines={2} style={[styles.textGray]}>
            {last_message.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Inbox({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const api = `https://konext.vercel.app/api/messages?user_id=${user.id}&page=1&count=50`;
  const [loadingRawMessages, rawmessages, error, reloadMessages] =
    useFetch(api);
  const nomsg = "You have no messages for now";
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reloadMessages();
    }, [])
  );

  useEffect(() => {
    setloading(true);
    if (rawmessages) {
      const parsedMessages = Object.entries(rawmessages);
      setmessages(parsedMessages);
      setloading(false);
    }
    setloading(false);
  }, [rawmessages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loadingRawMessages || loading ? (
          <ActivityIndicator
            animating={loadingRawMessages}
            style={[styles.paddingLarge]}
          />
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              setloading(true);
              reloadMessages();
            }}
          >
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        ),
    });
  }, [navigation]);

  const handleContactPress = (message_data) => {
    //alert(JSON.stringify(message_data));

    navigation.navigate("ViewMessage", message_data);
  };

  const onRenderContact = (item) => (
    <ContactItem contact_data={item} handleContactPress={handleContactPress} />
  );

  const onExtractContactKey = (item) => item[0];

  return (
    <View>
      {<ActivityIndicator animating={loadingRawMessages} color={KOOP_BLUE} />}
      {!loadingRawMessages && messages.length === 0 && (
        <Text style={[styles.paddingLarge, styles.textCenter]}>
          No Messages
        </Text>
      )}
      {messages && messages.length > 0 && (
        <FlatList
          data={messages}
          keyExtractor={onExtractContactKey}
          renderItem={onRenderContact}
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
