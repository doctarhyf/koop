import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import useFetch, { useFetch2 } from "../hooks/useFetch";
import UserContext from "../context/UserContext";
import styles from "../helpers/styles";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ParseCreatedAt } from "../helpers/funcs";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";

const TAB = {
  MY_ITEMS: 0,
  MY_SERVICES_REQUESTS: 1,
};

export default function MyItems({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const END_POINT_MY_SERVICES_REQUESTS = `https://konext.vercel.app/api/sreq?user_id=${user.id}`;
  const END_POINT_MY_ITEMS = `https://konext.vercel.app/api/items?user_id=${user.id}`;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTabID, setSelectedTabID] = useState(0);
  const [loadingdata, itemsdata, errordata, reloaddata] =
    useFetch2(END_POINT_MY_ITEMS);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `My Items - ${user.phone}`,

      headerRight: () =>
        loadingdata ? (
          <ActivityIndicator animating={loadingdata} color={KOOP_BLUE} />
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              if (selectedTabID === TAB.MY_ITEMS) {
                navigation.navigate("Provide");
              } else {
                navigation.navigate("ServiceRequest");
              }
            }}
          >
            <FontAwesome name="send" size={24} color={KOOP_BLUE} />
          </TouchableOpacity>
        ),
    });
  }, [route, loadingdata]);

  const onRefresh = () => {
    reloaddata();
  };

  useEffect(() => {
    const api =
      selectedTabID === TAB.MY_ITEMS
        ? END_POINT_MY_ITEMS
        : END_POINT_MY_SERVICES_REQUESTS;
    reloaddata(api);

    console.error("Reloading api ... ", api);
  }, [selectedTabID]);

  const extractKey = (item) => item.id;

  const handleServReqPress = (item) => {
    Alert.alert(item.label, item.desc);
  };

  const handleItemMyLongPress = (item) => {
    Alert.alert("Delete item?", "This action is not reversible", [
      {
        text: "NO",
      },
      {
        text: "DELETE",
        style: "destructive",
      },
    ]);
  };

  const renderItem = (item) => {
    const { id, label, created_at } = item.item; //service request
    const { name, desc, photos } = item.item; //service or product

    let date = "";
    const dateData = ParseCreatedAt(created_at);

    if (dateData) {
      date = dateData.full;
    }

    return selectedTabID === TAB.MY_SERVICES_REQUESTS ? (
      <TouchableOpacity onPress={(e) => handleServReqPress(item.item)}>
        <View
          style={[
            styles.paddingSmall,
            { borderBottomWidth: 1, borderBottomColor: "#dddddd" },
          ]}
        >
          <Text style={{ fontWeight: "bold" }}>{label}</Text>
          <Text style={{ color: "#333333" }}>{date}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={(e) => navigation.navigate("ServiceInfo", item.item)}
        onLongPress={handleItemMyLongPress}
      >
        <View
          style={[
            styles.flexRow,
            styles.paddingSmall,
            {
              justifyContent: "space-between",
              borderBottomColor: "#dddddd",
              borderBottomWidth: 1,
            },
          ]}
        >
          <Image
            transition={1000}
            source={photos ? photos[0] : require("../assets/rhyf.png")}
            style={[
              {
                width: 70,
                height: 70,
                marginRight: 12,
                borderRadius: 35,
                overflow: "hidden",
              },
            ]}
          />

          <View style={[{ flex: 1 }]}>
            <View style={[styles.flexRow, { flexGrow: 0 }]}>
              <Text style={[{ flexGrow: 1, fontWeight: "bold" }]}>{name}</Text>
              <Text style={[styles.textGray]}>{date}</Text>
            </View>
            <Text
              numberOfLines={3}
              style={[styles.textGray, { flexShrink: 1 }]}
            >
              {desc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ flex: 1 }]}>
      <View style={[st.menu]}>
        {["Mes Articles & Services", "Demandes et Recherches"].map((it, i) => (
          <TouchableOpacity key={i} onPress={(e) => setSelectedTabID(i)}>
            <Text style={[st.btn, selectedTabID === i ? st.active : null]}>
              {it}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errordata && <Text>{JSON.stringify(errordata)}</Text>}
      <FlatList
        style={[{ padding: 12 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={itemsdata}
        keyExtractor={extractKey}
        renderItem={renderItem}
      />
    </View>
  );
}

const st = StyleSheet.create({
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  btn: {
    padding: 12,

    borderRadius: 18,
    overflow: "hidden",
  },
  active: {
    color: "#ffffff",
    borderBottomColor: KOOP_BLUE,
    backgroundColor: KOOP_BLUE,
  },
});
