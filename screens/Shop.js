import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import MenuButton from "../components/MenuButton";
import styles from "../helpers/styles";
import { useLayoutEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import SimpleTextButton from "../components/SimpleTextButton";

export default function Shop({ route, navigation }) {
  const [loading, setloading] = useState(false);
  let { params } = route;
  const shop = params;
  const {
    shop_profile,
    shop_name,
    shop_tags,
    shop_desc,
    shop_add,
    shop_email,
    shop_whatsapp,
    shop_wechat,
    shop_tiktok,
    shop_facebook,
    shop_id,
    from_id,
    to_id,
  } = shop;

  const CONTACTS = [
    {
      id: shop_email,
      icon: require("../assets/icons/mail.png"),
    },
    {
      id: shop_whatsapp,
      icon: require("../assets/icons/whatsapp.png"),
    },
    {
      id: shop_wechat,
      icon: require("../assets/icons/wechat.png"),
    },
    {
      id: shop_tiktok,
      icon: require("../assets/icons/tiktok.png"),
    },
    {
      id: shop_facebook,
      icon: require("../assets/icons/facebook.png"),
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: shop_name,
    });
  }, [navigation]);

  const onProdAndServ = (e) => {
    alert("Prods and servs");
  };

  return (
    <ScrollView style={[styles.bgWhite, styles.flex1]}>
      <View>
        <ImageBackground
          source={{
            uri:
              shop_profile ||
              "https://i.ytimg.com/vi/D4EKydVVvHk/hqdefault.jpg?v=64668f72",
          }}
          style={[st.img, styles.justifyEnd]}
        >
          <View
            style={[
              styles.paddingMid,
              styles.bgWhite,
              st.cont,
              styles.borderTopRadiusLarge,
            ]}
          >
            <MenuButton
              btn={{
                id: 0,
                label: "SEND MESSAGE",
                icon: require("../assets/icons/mail.png"),
              }}
              handleOnPress={(e) => {
                navigation.navigate("SendMessage", shop);
              }}
            />
          </View>
        </ImageBackground>
        <View style={styles.paddingMid}>
          <Text style={[styles.textBlue]}>About</Text>

          {shop_desc ? (
            <View style={[st.tagscont]}>
              {shop_desc.split(";").map((t, i) => (
                <Text style={[st.tag]} key={i}>
                  {t}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={[{ fontStyle: "italic", color: "#ddd" }]}>
              About {shop_name}
            </Text>
          )}

          {shop_add && (
            <View>
              <Text style={[styles.textBlue, , styles.marginTopLarge]}>
                Address
              </Text>
              <Text>{shop_add}</Text>
            </View>
          )}

          <Text style={[styles.textBlue, , styles.marginTopLarge]}>
            Contacts
          </Text>

          {CONTACTS.map(
            (contact, i) =>
              contact.id && (
                <TouchableOpacity key={i}>
                  <View
                    key={i}
                    style={[styles.alignCenter, styles.mtLarge, styles.flexRow]}
                  >
                    <Image source={contact.icon} style={st.ctico} />
                    <Text style={styles.marginH}>{contact.id}</Text>
                  </View>
                </TouchableOpacity>
              )
          )}

          <SimpleTextButton text={"Commentaires"} handlePress={(e) => null} />

          <SimpleTextButton
            text={"Products and Services"}
            handlePress={onProdAndServ}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  img: {
    height: 340,
    width: "100%",
    resizeMode: "cover",
  },
  ctico: {
    width: 30,
    height: 30,
  },
  tag: {
    backgroundColor: "#ddd",
    flexShrink: 1,
    margin: 4,
    padding: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  tagscont: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
