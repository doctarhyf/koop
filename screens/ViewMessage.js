import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  EmptyState,
  IconButton,
  PressableScale,
  Text,
  TextInput,
  haptic,
} from "../components/ui";
import { colors, fonts, gradients, space, type } from "../theme";
import * as API from "../utils/api";
import UserContext from "../context/UserContext";
import { ParseCreatedAt } from "../helpers/funcs";
import { supabase } from "../utils/supabase";

export default function ViewMessage({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
  const contact_data = route.params;
  const contact = contact_data.item[1][0];
  let messages_data = contact_data.item[1];
  const [messages, setmessages] = useState(messages_data.slice(1));
  const [loading, setloading] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  //alert(JSON.stringify(contact_data.item[1]));

  const listRef = useRef(null);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Avatar uri={contact.profile} name={contact.display_name} size={32} />
          <View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15 }} numberOfLines={1}>
              {contact.display_name}
            </Text>
            {contact.shop_name ? (
              <Text style={[type.caption, { color: colors.textMuted }]} numberOfLines={1}>
                {contact.shop_name}
              </Text>
            ) : null}
          </View>
        </View>
      ),
      headerRight: () => (
        <IconButton
          name="shopping-bag"
          size={36}
          onPress={() => navigation.navigate("Shop", contact_data.item[1][0], { pop: true })}
        />
      ),
    });
  }, [route]);

  const onRenderMessage = ({ item: message, index }) => {
    const { content, me } = message;
    const prev = messages[index - 1];
    const grouped = prev && !!prev.me === !!me;
    return (
      <View style={[st.msgRow, { justifyContent: me ? "flex-end" : "flex-start", marginTop: grouped ? 3 : space.sm }]}>
        {me ? (
          <LinearGradient
            colors={gradients.brand.slice(1)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[st.bubble, st.bubbleMe]}
          >
            <Text style={[type.body, { color: "#fff" }]}>{content}</Text>
            <Text style={[st.time, { color: "rgba(255,255,255,0.75)" }]}>{message.timeAgo}</Text>
          </LinearGradient>
        ) : (
          <View style={[st.bubble, st.bubbleThem]}>
            <Text style={type.body}>{content}</Text>
            <Text style={[st.time, { color: colors.textFaint }]}>{message.timeAgo}</Text>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "koop_messages" },
        (payload) => {
          console.log("Change received!", payload);
          Vibration.vibrate(250);
          const newmsg = payload.new;
          newmsg.me = newmsg.from_id === user.id;

          setmessages((prev) => [...prev, newmsg]);
        }
      )
      .subscribe();

    //return () => channels.remove();
  }, []);

  const onSendMessage = async () => {
    if (newMessage.trim().length === 0) return;
    haptic("light");
    setloading(true);

    await API.sendMessage({
      from_id: user.id,
      to_id: contact.id,
      content: newMessage,
    });

    setNewMessage("");
    setloading(false);
  };

  const canSend = newMessage.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={onRenderMessage}
        contentContainerStyle={[{ padding: space.md, paddingBottom: space.lg }, messages.length === 0 && { flex: 1, justifyContent: "center" }]}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <EmptyState icon="message-circle" title="Démarrez la conversation" subtitle="Dites bonjour 👋" />
        }
      />

      <View style={[st.composer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <TextInput
          style={st.input}
          placeholder="Écrire un message…"
          value={newMessage}
          multiline
          onChangeText={(txt) => setNewMessage(txt)}
        />
        <PressableScale
          onPress={onSendMessage}
          disabled={!canSend || loading}
          scaleTo={0.88}
          hapticKind={null}
          style={[st.send, !canSend && { opacity: 0.4 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Feather name="arrow-up" size={20} color="#fff" />
          )}
        </PressableScale>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  msgRow: { flexDirection: "row" },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 2,
  },
  bubbleMe: { borderBottomRightRadius: 6 },
  bubbleThem: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  time: { fontSize: 10, fontFamily: fonts.medium, alignSelf: "flex-end" },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 22,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
