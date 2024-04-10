import React, { useState, useLayoutEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as API from "../utils/api";
import styles from "../helpers/styles";
import UserContext from "../context/UserContext";
import { FontAwesome } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import { insertItem, sendMessage } from "../utils/db";
import { TABLE_NAMES } from "../utils/supabase";
import TextButton from "../components/TextButton";

export default function SendMessage({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);

  const { shop_name, shop_id, from_id, to_id, name } = route.params;
  const [message, setmessage] = useState(
    `Hello, ${shop_name}, I would like to know more about ${name} please!`
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : (
          <TouchableOpacity onPress={onSendMessage}>
            <FontAwesome name="send" size={24} color={KOOP_BLUE} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, loading, message]);

  const onSendMessage = async (e) => {
    setloading(true);

    const res = await API.sendMessage({
      from_id: from_id,
      to_id: to_id,
      content: message,
    });

    if (res.id) {
      Alert.alert(
        "Message sent",
        `Your message to ${shop_name} has been sent successfully!`
      );
      console.error(JSON.stringify(res));
    } else {
      Alert.alert("Error sending message", JSON.stringify(res));
    }
    navigation.goBack();

    setloading(false);
  };

  return (
    <View style={[styles.paddingSmall]}>
      <View style={[styles.flexRow]}>
        <Text style={[styles.textGray]}>Send to : </Text>
        <Text>{shop_name}</Text>
      </View>
      <TextInput
        style={[styles.ti]}
        value={message}
        onChangeText={(txt) => setmessage(txt)}
        multiline={true}
        numberOfLines={5}
      />
      <TextButton
        label={"View Shop"}
        handlePress={(e) => navigation.navigate("Shop", route.params)}
      />
    </View>
  );
}
