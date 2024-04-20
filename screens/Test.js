import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";

export default function Test() {
  const [phone, setphone] = useState("+243980967780");

  const getOTP = async () => {
    /* let { data, error } = await supabase.auth.signUp({
      phone: phone,
      password: "some-password",
    });

    */

    /* let { data, error } = await supabase.auth.verifyOtp({
      phone: "+243980967780",
      token: "810170",
      type: "sms",
    }); */

    console.error("data => ", data);
    console.error("error => ", error);
    alert(JSON.stringify(data));
  };

  return (
    <View>
      <TextInput
        placeholder="phone"
        value={phone}
        onChangeText={(txt) => setphone(txt)}
      />
      <Button title="Get OTP" onPress={getOTP} />
    </View>
  );
}
