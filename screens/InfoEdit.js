import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";

import { Button } from "react-native";
import TextButton from "../components/TextButton";
import styles from "../helpers/styles";
import { UserContext } from "../App";
import { updatePersShopInfo } from "../utils/db";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";

const VILLES = [
  "Kinshasa",
  "Lubumbashi",
  "Mbuji-Mayi",
  "Kananga",
  "Kisangani",
  "Bukavu",
  "Tshikapa",
  "Kolwezi",
  "Likasi",
  "Goma",
  "Bunia",
  "Matadi",
  "Uvira",
  "Isiro",
  "Boma",
  "Beni",
  "Butembo",
  "Mbandaka",
  "Kikwit",
  "Bumba",
  "Autre",
];

export default function InfoEdit({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const [loading, setloading] = useState(false);
  const { params } = route;
  const dataKey = params[0];
  const dataContent = params[1];
  const curval = dataContent.value || "";
  const [newValue, setNewValue] = useState(curval);
  const [bday, setbday] = useState();

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed in JavaScript Date objects
  };

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

  const parseBDay = (date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
  };

  const openDateTimePicker = async () => {
    if (Platform.OS === "android") {
      try {
        const { action, year, month, day } = await DateTimePickerAndroid.open({
          value: new Date(),
          mode: "spinner",
          onChange: (event, date) => {
            const {
              type,
              nativeEvent: { timestamp, utcOffset },
            } = event;
            //alert(date);
            setNewValue(parseBDay(date));
          }, // 'calendar' or 'spinner' mode
        });
        if (action !== DateTimePickerAndroid.dismissedAction) {
          // Date selected
          const selectedDate = new Date(year, month, day);
          console.log("Selected Date:", selectedDate);
        }
      } catch ({ code, message }) {
        //alert("Cannot open date picker" + message);
      }
    } else {
      setShowPicker(true);
    }
  };

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (bday && dataKey === "dob") {
      const d = bday.getDate();
      const m = bday.getMonth() + 1;
      const y = bday.getFullYear();

      const newValue = `${d}/${m}/${y}`;
      setNewValue(newValue);
    }
  }, [bday]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate; // || date;
    //setShowPicker(Platform.OS === 'ios');

    setbday(currentDate);
  };

  return (
    <View style={[styles.paddingMid]}>
      {dataKey !== "dob" && (
        <TextInput
          keyboardType={dataKey === "email" ? "email-address" : "default"}
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
      )}
      {dataKey === "dob" && (
        <View>
          <Text style={[styles.marginVMin]}>Date of birth: {newValue}</Text>
          {Platform.OS === "android" && (
            <TouchableOpacity onPress={openDateTimePicker}>
              <Text>Choose date</Text>
            </TouchableOpacity>
          )}
          {Platform.OS === "ios" && (
            <DateTimePicker
              testID="dateTimePicker"
              value={bday || parseDate(newValue)}
              mode="date" // 'date', 'time', or 'datetime' mode
              is24Hour={true}
              display="default"
              onChange={onChange} // 'default', 'spinner', or 'calendar' display
            />
          )}
        </View>
      )}
      {dataKey === "ville" && (
        <View style={[st.villecont]}>
          {VILLES.map((v, i) => (
            <TouchableOpacity onPress={(e) => setNewValue(v)}>
              <Text style={[st.ville, newValue === v ? st.selected : null]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  villecont: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  ville: {
    borderWidth: 1,
    borderColor: "#ffffff00",
    padding: 8,
    margin: 4,
    backgroundColor: "#ddd",
    borderRadius: 16,
    overflow: "hidden",
  },
  selected: {
    borderColor: KOOP_BLUE,
    borderWidth: 1,
    color: KOOP_BLUE_DARK,
  },
});
