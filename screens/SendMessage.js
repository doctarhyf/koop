import React, { useState, useLayoutEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../helpers/styles";
import { UserContext } from "../App";
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

  //alert(JSON.stringify(route.params));

  //alert(`from_id: ${from_id}\nto_id : ${to_id}`);
  // alert(`${JSON.stringify(route.params)}`);

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
    alert(JSON.stringify(res));

    /* //alert(`Sending message from ${from_id} to ${to_id}, message : ${message}`);
    //return;
    const res = await sendMessage(from_id, to_id, message);
    const [inbox, outbox] = res;

    //alert(JSON.stringify(res));

    if (
      inbox &&
      inbox[0] &&
      inbox[0].created_at &&
      outbox &&
      outbox[0] &&
      outbox[0].created_at
    ) {
      Alert.alert("Message sent", "Your message has been sent successfully", [
        {
          text: "OK",
          onPress: (e) => {
            setloading(false);
            navigation.goBack();
          },
        },
      ]);
    } else {
      setloading(false);
      alert("Error sending message\n" + JSON.stringify(res));
    }

    console.error("sendMsg => ", res); */

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
