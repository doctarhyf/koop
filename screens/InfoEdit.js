import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import TextButton from "../components/TextButton";
import styles from "../helpers/styles";
import { UserContext } from "../App";
import { updatePersShopInfo } from "../utils/db";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InfoEdit({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const [loading, setloading] = useState(false);
  const { params } = route;
  const dataKey = params[0];
  const dataContent = params[1];
  const curval = dataContent.value || "";
  const [newValue, setNewValue] = useState(curval);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: dataContent.label,
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : (
          <TextButton iconName="save" label={"SAVE"} handlePress={saveItem} />
        ),
    });
  }, [navigation, loading, newValue]);

  const saveItem = async (e) => {
    setloading(true);

    const res = await updatePersShopInfo(user, dataKey, newValue);

    if (Array.isArray(res) && res.length === 1) {
      alert(`${dataContent.label} updated successfully!`);
      const newuserdata = { ...user, [dataKey]: newValue };
      await AsyncStorage.setItem("@KOOP:user", JSON.stringify(newuserdata));
      setuser(newuserdata);
      navigation.goBack();
    }
    // alert(JSON.stringify(res));

    setloading(false);
  };

  return (
    <View style={[styles.paddingMid]}>
      <TextInput
        selectTextOnFocus={true}
        multiline={dataKey === "shop_desc" ? true : false}
        numberOfLines={dataKey === "shop_desc" ? 10 : 1}
        value={newValue}
        onChangeText={(txt) => setNewValue(txt)}
        style={[styles.ti]}
        placeholder={
          dataKey === "shop_desc" ? "this is your shop description .." : ""
        }
      />
      {dataKey === "dob" && (
        <Text style={[styles.marginVMin, styles.textGray]}>
          Date of birth ex: 25/12/1990
        </Text>
      )}
    </View>
  );
}
