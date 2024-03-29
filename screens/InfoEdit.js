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
import UserContext from "../context/UserContext";
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

const categoriesEntreprises = [
  "Commerce de détail",
  "Alimentation et boissons",
  "Hôtellerie",
  "Technologie",
  "Santé",
  "Finance",
  "Immobilier",
  "Automobile",
  "Éducation",
  "Divertissement",
  "Mode",
  "Construction",
  "Transport",
  "Fabrication",
  "Fitness et bien-être",
  "Juridique",
  "Médias et communications",
  "Consultation",
  "Tourisme",
  "Commerce électronique",
  "Autre",
];

function InfoEdit({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);

  const [loading, setloading] = useState(false);
  const { params } = route;
  const dataKey = params[0];
  const dataContent = params[1];
  const isFirstSetup = params[2];
  const curval = dataContent.value || "";
  const [newValue, setNewValue] = useState(curval);
  const [bday, setbday] = useState();
  const [shoptags, setshoptags] = useState([]);

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
    if (isFirstSetup) {
      await AsyncStorage.removeItem("tmp");
      if (newValue.trim().length > 0) {
        const data = { key: dataKey, val: newValue };
        await AsyncStorage.setItem(
          "tmp",
          JSON.stringify(data).replace(";;", ";")
        );
      }
      navigation.goBack();
      setloading(false);
      return;
    }

    const res = await updatePersShopInfo(user, dataKey, newValue);

    if (Array.isArray(res) && res.length === 1) {
      alert(`${dataContent.label} updated successfully!`);
      const newuserdata = { ...user, [dataKey]: newValue };
      await AsyncStorage.setItem("@KOOP:user", JSON.stringify(newuserdata));
      setuser(newuserdata);
      navigation.goBack();
    }

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

  const onCatSelect = (newcat) => {
    const idx = newValue.indexOf(newcat);
    const len = newcat.length;
    if (idx === -1) {
      const nv = newValue + ";" + newcat;
      setNewValue(nv);
    } else {
      const nv = newValue.replace(newcat, "");
      setNewValue(nv);
    }
  };

  useEffect(() => {
    const tags = [...new Set(newValue.split(";"))];
    setshoptags(tags);
  }, [newValue]);

  return (
    <View style={[styles.paddingMid]}>
      {/*  <Text>{dataKey}</Text> */}
      {dataKey !== "dob" && dataKey !== "shop_tags" && dataKey !== "ville" && (
        <TextInput
          keyboardType={
            dataKey === "email" || dataKey === "shop_email"
              ? "email-address"
              : dataKey === "shop_whatsapp"
              ? "phone-pad"
              : "default"
          }
          selectTextOnFocus={true}
          multiline={true}
          numberOfLines={10}
          value={newValue}
          onChangeText={(txt) => setNewValue(txt)}
          style={[styles.ti]}
          placeholder={
            dataKey === "shop_desc"
              ? "this is your shop description .."
              : dataKey === "email" || dataKey === "shop_email"
              ? "ex: drrhyf@gmail.com"
              : dataKey === "shop_web"
              ? "https://myshop.com"
              : dataKey === "shop_add"
              ? `ex: No 22
Avenue de l'Enseignement, Quartier Kasa-Vubu
Commune de Ngaliema
Kinshasa
Democratic Republic of the Congo`
              : ""
          }
        />
      )}

      {dataKey === "ville" && <Text style={[styles.ti]}>{newValue}</Text>}
      {dataKey === "shop_add" && <View style={[st.map]}></View>}

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
            <TouchableOpacity key={i} onPress={(e) => setNewValue(v)}>
              <Text style={[st.ville, newValue === v ? st.selected : null]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {dataKey === "shop_tags" && (
        <View>
          {/* <Text style={[styles.ti]}>{shoptags.join(";")}</Text> */}
          <View style={[st.villecont]}>
            {categoriesEntreprises.map((cat, i) => (
              <TouchableOpacity onPress={(e) => onCatSelect(cat)}>
                <Text
                  style={[
                    st.ville,
                    shoptags.includes(cat) ? st.selected : null,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {dataKey === "shop_desc" && (
        <Text style={[styles.textGray]}>
          ex: Notre entreprise de construction, basée en République démocratique
          du Congo, se distingue par son expertise dans la construction de
          maisons résidentielles. Avec un engagement ferme envers la qualité et
          la satisfaction client, nous réalisons des projets qui incarnent le
          confort, la fonctionnalité et l'esthétique. Notre équipe expérimentée
          allie solutions de design innovantes et normes de construction
          rigoureuses pour chaque projet, répondant ainsi aux aspirations
          uniques de nos clients. De la conception à la réalisation, nous nous
          engageons à fournir des structures résidentielles exceptionnelles,
          témoignant de notre engagement indéfectible envers l'excellence dans
          le paysage de la construction en RDC.
        </Text>
      )}
    </View>
  );
}

InfoEdit.ROUTE = "InfoEdit";

export default InfoEdit;

const st = StyleSheet.create({
  map: {
    backgroundColor: KOOP_BLUE,
    height: 260,
    marginTop: 12,
  },
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
    backgroundColor: KOOP_BLUE,

    borderWidth: 1,
    color: "white",
  },
});
