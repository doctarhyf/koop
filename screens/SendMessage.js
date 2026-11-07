import { Feather } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Input, Text, haptic } from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, space, type } from "../theme";
import * as API from "../utils/api";

export default function SendMessage({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);

  const { shop_name, shop_id, from_id, to_id, name } = route.params;
  const [message, setmessage] = useState("");

  const onSendMessage = async (e) => {
    setloading(true);

    const res = await API.sendMessage({
      from_id: from_id,
      to_id: to_id,
      content: message,
    });

    if (res.id) {
      haptic("success");
      Alert.alert(
        "Message envoyé",
        `Votre message à ${shop_name} a bien été envoyé.`
      );
      console.error(JSON.stringify(res));
    } else {
      Alert.alert("Error sending message", JSON.stringify(res));
    }
    navigation.goBack();

    setloading(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space.lg, gap: space.lg }}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
        <View style={st.to}>
          <Feather name="shopping-bag" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: colors.textMuted }]}>DESTINATAIRE</Text>
          <Text style={type.title} numberOfLines={1}>{shop_name}</Text>
        </View>
        <Button
          title="Voir"
          variant="secondary"
          size="sm"
          full={false}
          onPress={() => navigation.navigate("Shop", route.params, { pop: true })}
        />
      </Card>

      {name ? (
        <View style={st.context}>
          <Feather name="corner-down-right" size={14} color={colors.textMuted} />
          <Text style={[type.small, { color: colors.textMuted, flex: 1 }]} numberOfLines={2}>
            À propos de : <Text style={{ fontWeight: "600", color: colors.text }}>{name}</Text>
          </Text>
        </View>
      ) : null}

      <Input
        label="Votre message"
        value={message}
        onChangeText={(txt) => setmessage(txt)}
        multiline
        placeholder="Bonjour, je suis intéressé(e) par…"
        autoFocus
      />

      <Button
        title="Envoyer"
        icon="send"
        loading={loading}
        disabled={message.trim().length === 0}
        onPress={onSendMessage}
      />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  to: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  context: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 4 },
});
