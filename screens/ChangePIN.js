import { View, Text, TextInput, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../helpers/styles";
import SimpleTextButton from "../components/SimpleTextButton";
import { UserContext } from "../App";

import { KOOP_BLUE } from "../helpers/colors";
import { updatePersShopInfo } from "../utils/db";

const PIN_ERROR = {
  CUR_PIN_ERROR: 0,
  NEW_PIN_DONT_MATCH: 1,
  NEW_PIN_EQUAL_CURRENT_PIN: 2,
};

export default function ChangePIN({ navigation, route }) {
  const user = route.params;
  const [loading, setloading] = useState(false);
  const [currentpin, setcurrentpin] = useState("");
  const [newpin, setnewpin] = useState("");
  const [renewpin, setrenewpin] = useState("");
  const [errors, seterrors] = useState({});
  const [noerrors, setnoerrors] = useState(false);

  useEffect(() => {
    if (currentpin !== user.pin) {
      seterrors((old) => ({
        ...old,
        [PIN_ERROR.CUR_PIN_ERROR]: "Wrong current pin inserted",
      }));
    } else {
      seterrors((old) => ({ ...old, [PIN_ERROR.CUR_PIN_ERROR]: null }));
    }

    if (newpin !== renewpin) {
      seterrors((old) => ({
        ...old,
        [PIN_ERROR.NEW_PIN_DONT_MATCH]: "New pins dont macth",
      }));
    } else {
      seterrors((old) => ({ ...old, [PIN_ERROR.NEW_PIN_DONT_MATCH]: null }));
    }

    if (user.pin === newpin) {
      seterrors((old) => ({
        ...old,
        [PIN_ERROR.NEW_PIN_EQUAL_CURRENT_PIN]: "New pins equal current pin",
      }));
    } else {
      seterrors((old) => ({
        ...old,
        [PIN_ERROR.NEW_PIN_EQUAL_CURRENT_PIN]: null,
      }));
    }

    setnoerrors(errors[0] === null && errors[1] === null && errors[2] === null);
  }, [currentpin, newpin, renewpin]);

  const handlePress = async () => {
    if (
      (errors[0] === null && errors[1] === null && errors[2] === null) === false
    ) {
      alert(JSON.stringify(errors));
    } else {
      setloading(true);
      const res = await updatePersShopInfo(user, "pin", newpin);
      if (res && res[0] && res[0].id) {
        alert("PIN updated!");
        navigation.goBack();
      }
      setloading(false);
    }
  };

  return (
    <View style={[styles.paddingMid]}>
      <Text>Current PIN : {user.pin}</Text>
      <TextInput
        secureTextEntry
        keyboardType="phone-pad"
        value={currentpin}
        onChangeText={setcurrentpin}
        style={[styles.ti]}
      />
      <Text>New PIN</Text>
      <TextInput
        value={newpin}
        onChangeText={setnewpin}
        secureTextEntry
        keyboardType="phone-pad"
        style={[styles.ti]}
      />
      <Text>Re-New PIN</Text>
      <TextInput
        value={renewpin}
        onChangeText={setrenewpin}
        secureTextEntry
        keyboardType="phone-pad"
        style={[styles.ti]}
      />

      {loading ? (
        <ActivityIndicator animating={loading} color={KOOP_BLUE} />
      ) : (
        <SimpleTextButton text={"CHANGE"} handlePress={handlePress} />
      )}

      {Object.values(errors).map(
        (e, i) => e && <Text style={[{ color: "red" }]}>{e}</Text>
      )}
    </View>
  );
}