import React, {
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Avatar,
  EmptyState,
  FadeIn,
  ListSkeleton,
  PressableScale,
  Text,
} from "../components/ui";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/UserContext";
import { colors, radius, space, type } from "../theme";

const MESSAGE_TYPE = {
  INBOX: "inbox",
  OUTBOX: "outbox",
};

const ContactItem = ({ contact_data, handleContactPress, index }) => {
  const contact = contact_data.item[1][0];
  if (contact === null || contact === undefined) return null;

  const last_message = contact_data.item[1][contact_data.item[1].length - 1];
  const { shop_name, profile, display_name } = contact;

  return (
    <FadeIn delay={Math.min(index, 8) * 40}>
      <PressableScale onPress={() => handleContactPress(contact_data)} scaleTo={0.985} style={st.row}>
        <Avatar uri={profile} name={shop_name || display_name} size={54} />
        <View style={{ flex: 1, gap: 3 }}>
          <View style={st.rowTop}>
            <Text numberOfLines={1} style={[type.title, { flex: 1 }]}>
              {shop_name || display_name}
            </Text>
            <Text style={[type.caption, { color: colors.textFaint }]}>{last_message?.timeAgo}</Text>
          </View>
          <Text numberOfLines={1} style={[type.small, { color: colors.textMuted }]}>
            {last_message?.me ? "Vous : " : ""}
            {last_message?.content}
          </Text>
        </View>
      </PressableScale>
    </FadeIn>
  );
};

export default function Inbox({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const api = `https://konext.vercel.app/api/messages?user_id=${user.id}&page=1&count=100`;
  console.error(`Loading messages \n`, api);
  const [loadingRawMessages, rawmessages, error, reloadMessages] =
    useFetch(api);
  const nomsg = "You have no messages for now";
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      Vibration.vibrate(250);
    }
    setloading(false);
  }, [rawmessages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ActivityIndicator
          color={colors.primary}
          animating={refreshing || loadingRawMessages}
        />
      ),
    });
  }, [navigation, refreshing, loadingRawMessages]);

  const handleContactPress = (message_data) => {
    //alert(JSON.stringify(message_data));

    navigation.navigate("ViewMessage", message_data, { pop: true });
  };

  const onRenderContact = ({ item, index }) => (
    <ContactItem contact_data={{ item }} index={index} handleContactPress={handleContactPress} />
  );

  const onExtractContactKey = (item) => String(item[0]);
  const onRefresh = () => {
    reloadMessages();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {loadingRawMessages && messages.length === 0 ? (
        <View style={{ padding: space.lg }}>
          <ListSkeleton rows={6} />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          data={messages}
          keyExtractor={onExtractContactKey}
          renderItem={onRenderContact}
          contentContainerStyle={[st.list, messages.length === 0 && { flex: 1, justifyContent: "center" }]}
          ItemSeparatorComponent={() => <View style={st.sep} />}
          ListEmptyComponent={
            <EmptyState
              icon="message-circle"
              title="Aucun message"
              subtitle="Vos conversations avec les vendeurs et acheteurs apparaîtront ici."
            />
          }
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  list: { padding: space.lg, paddingBottom: space.xxxl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  rowTop: { flexDirection: "row", alignItems: "center", gap: space.xs },
  sep: { height: space.xs },
});
