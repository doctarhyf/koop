import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MenuButton from "../components/MenuButton";
import styles from "../helpers/styles";
import { useLayoutEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";

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

  //alert(JSON.stringify(shop));
  /*   alert(
    `from_id : ${from_id}, to_id : ${to_id}, equals : ${from_id === to_id}`
  ); */

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
      /* headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : (
          from_id !== to_id && (
            <TouchableOpacity onPress={onSendMessage}>
              <FontAwesome name="send" size={24} color={KOOP_BLUE} />
            </TouchableOpacity>
          )
        ), */
    });
  }, [navigation]);

  const onSendMessage = (e) => {
    navigation.navigate("SendMessage", {
      shop_name: shop_name,
      shop_id: shop_id,
      from_id: from_id,
      to_id: to_id,
    });
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
                alert("Should show send message GUI");
                navigation.navigate("Request");
              }}
            />
          </View>
        </ImageBackground>
        <View style={styles.paddingMid}>
          <Text style={[styles.textBlue]}>About</Text>
          <Text>
            {shop_desc ||
              `Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries.`}
          </Text>

          {/*  <Text style={[styles.textBlue, styles.marginTopLarge]}>Services</Text>
          <Text>- Service 1</Text>
          <Text>- Service 1</Text>
          <Text>- Service 1</Text>
          <Text>- Service 1</Text> */}
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
});
