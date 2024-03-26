import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import styles from "../helpers/styles";
import { UserContext } from "../App";
import TextButton from "../components/TextButton";

import { KOOP_BLUE } from "../helpers/colors";
import * as SB from "../utils/db";
import { TABLE_NAMES } from "../utils/supabase";

export default function ContactUs({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  const contactUs = async () => {
    setloading(true);
    const sent = await SB.insertItem(TABLE_NAMES.KOOP_CONTACT_US, {
      message: message,
      user_id: user.id,
    });

    alert(JSON.stringify(sent));
    setloading(false);
  };

  return (
    <View style={[styles.paddingMid]}>
      <Text>
        From: {user.display_name} - {user.phone}
      </Text>
      <TextInput placeholder="Sujet: " style={[styles.ti]} />
      <TextInput
        placeholder="Message ..."
        style={[styles.ti]}
        numberOfLines={6}
        value={message}
        onChangeText={setmessage}
      />

      {loading ? (
        <ActivityIndicator animation={loading} color={KOOP_BLUE} />
      ) : (
        <TouchableOpacity onPress={contactUs}>
          <Text style={[styles.textBlue, styles.textCenter]}>SEND MESSAGE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
