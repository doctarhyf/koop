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
import { useContext, useLayoutEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import SimpleTextButton from "../components/SimpleTextButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingButton from "../components/LoadingButton";
import UserContext from "../context/UserContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Shop({ route, navigation }) {
  const { user, setuser } = useContext(UserContext);
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

  const showAnnonces = (e) => {
    //alert("Prods and servs");
    navigation.navigate("MyItems", shop.id);
  };

  const showCommentaires = (e) => {
    navigation.navigate("Comments", { item_id: user.id, item_type: "shop" });
  };

  return (
    <ScrollView style={[styles.bgWhite, styles.flex1]}>
      <View>
        {/*  <ImageBackground
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
          ></View>
        </ImageBackground> */}

        <View>
          <Image
            source={
              shop_profile ||
              "https://i.ytimg.com/vi/D4EKydVVvHk/hqdefault.jpg?v=64668f72"
            }
            style={{ width: "100%", height: 180 }}
            transition={1000}
          />
        </View>

        <View style={styles.paddingMid}>
          <Text style={[styles.textBlue]}>About</Text>
          <Text>{shop_desc}</Text>

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

          <MenuButton
            btn={{
              id: 0,
              label: "TOUTES LES ANNONCES",
            }}
            icon={<FontAwesome5 name="bolt" size={28} color="brown" />}
            handleOnPress={showAnnonces}
          />

          <MenuButton
            btn={{
              id: 0,
              label: "TOUS LES COMMENTAIRES",
            }}
            icon={<FontAwesome name="comments" size={28} color="lime" />}
            iconColor={KOOP_BLUE}
            handleOnPress={showCommentaires}
          />

          {/* <LoadingButton
            icon={
              <MaterialCommunityIcons
                name="flash-alert"
                size={24}
                color="black"
              />
            }
            text={"TOUTES LES ANONCES"}
            handlePress={showAnnonces}
          />

          <LoadingButton
            icon={<FontAwesome name="comments" size={24} color="black" />}
            text={"COMMENTAIRES"}
            handlePress={showCommentaires}
          /> */}
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
