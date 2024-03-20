import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as COLORS from "../helpers/colors";
import styles from "../helpers/styles";
import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import { UserContext } from "../App";
import TextButton from "../components/TextButton";
import { AntDesign } from "@expo/vector-icons";
import { removeService } from "../utils/db";

export default function MyServices({ navigation }) {
  const { user, setuser } = useContext(UserContext);
  const [shop, setshop] = useState(null);
  const [itemsType, setItemsType] = useState("post");
  const [loading, setloading] = useState(false);
  const [loadingItems, items, error] = useItemsLoader(
    TABLE_NAMES.KOOP_ITEMS,
    "user_id",
    Number(user.id)
  );

  const [itemsf, setitemsf] = useState([]);
  const [key, setkey] = useState(Math.random());

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Products & Services",
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} color={COLORS.KOOP_BLUE} />
        ) : (
          <TextButton
            iconName="bolt"
            label={"POSTER"}
            handlePress={(e) => navigation.replace("Provide")}
          />
        ),
    });
  }, [navigation, loading]);

  useEffect(() => {
    console.error("items loaded => ", items);
  }, [items]);

  const onItemsTypeSelect = (type) => {
    setItemsType(type);
  };

  const onDeleteItem = (it) => {
    Alert.alert("Delete Item?", "Are you sure you wanna delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          setloading(true);

          await removeService(it);
          items.splice(items.indexOf(it), 1);

          Alert.alert("Item deleted!", "The item was removed successfully", [
            {
              text: "OK",
            },
          ]);

          setloading(false);
        },
      },
    ]);
  };

  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.bgWhite]}>
        {[
          { label: "POSTED SERVICES", type: "post", icon: null },
          { label: "REQUESTED SERVICES", type: "red", icon: null },
        ].map((it, i) => (
          <TouchableOpacity key={i} onPress={(e) => onItemsTypeSelect(it.type)}>
            <Text
              style={[
                styles.paddingSmall,
                itemsType === it.type ? st.on : st.off,
              ]}
            >
              {it.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {items && items.map && (
        <ScrollView key={key}>
          {items.map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("ServiceInfo", it)}
            >
              <View
                style={[
                  styles.flexRow,
                  styles.paddingSmall,
                  styles.justifyBetween,
                  styles.flex1,
                ]}
              >
                <Image
                  style={[{ width: 60, height: 60 }, styles.marginRight]}
                  source={{ uri: it.photos[0] }}
                />
                <View
                  style={[styles.alignSelfStart, { flexGrow: 1, flex: 1 / 2 }]}
                >
                  <Text>{it.name}</Text>
                  <Text numberOfLines={2} style={[styles.textGray]}>
                    {it.desc}
                  </Text>
                  <Text style={[{ fontSize: 12 }, styles.textGray]}>
                    {it.created_at}
                  </Text>
                </View>
                <TouchableOpacity onPress={(e) => onDeleteItem(it)}>
                  <View
                    style={[
                      {
                        width: 30,
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <AntDesign
                      name="delete"
                      size={24}
                      color={COLORS.KOOP_BLUE}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {(items === null || items === undefined || items.length === 0) && (
        <View style={[styles.paddingLarge]}>
          {loadingItems ? (
            <ActivityIndicator
              animating={loadingItems}
              color={COLORS.KOOP_BLUE}
            />
          ) : (
            <Text style={[styles.textCenter, styles.textGray]}>
              No items yet
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  on: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.KOOP_BLUE,
    color: COLORS.KOOP_BLUE,
  },
});
