import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import styles from "../helpers/styles";
import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_LIGHT,
  KOOP_BLUE_TRANSLUCIDE,
} from "../helpers/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { editable } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";

export default TabShopInfo = ({ user, handleInfoPress, navigation }) => {
  //console.error("user data => ", user);

  const shopInfo = {
    shop_name: {
      value: user.shop_name,
      icon: "user",
      placeholder: "Business name",
      editable: false,
      label: "Shop Name",
    },
    shop_desc: {
      value: user.shop_desc,
      icon: "align-right",
      placeholder: "Business description",
      editable: true,
      label: "Shop Description",
    },
    shop_add: {
      value: user.shop_add,
      icon: "location-arrow",
      placeholder: "Shop Physical Address",
      editable: true,
      label: "Shop Physical Address",
    },
    shop_tags: {
      value: user.shop_tags,
      icon: "tags",
      placeholder: "Shop Tags",
      editable: true,
      label: "Shop Tags",
    },
    shop_email: {
      value: user.shop_email,
      icon: "envelope",
      placeholder: "Shop Email address",
      editable: true,
      label: "Shop Email Address",
    },
    shop_web: {
      value: user.shop_web,
      icon: "globe",
      placeholder: "Shop Website",
      editable: true,
      label: "Shop Website",
    },

    //social start
    shop_whatsapp: {
      value: user.shop_whatsapp,
      icon: "globe",
      placeholder: "Shop Whatsapp",
      editable: true,
      label: "Shop Whatsapp",
      social: true,
      soc_icon: require("../assets/icons/whatsapp.png"),
    },
    shop_wechat: {
      value: user.shop_wechat,
      icon: "globe",
      placeholder: "Shop Wechat",
      editable: true,
      label: "Shop Website",
      social: true,
      soc_icon: require("../assets/icons/wechat.png"),
    },
    shop_tiktok: {
      value: user.shop_tiktok,
      icon: "globe",
      placeholder: "Shop Tiktok",
      editable: true,
      label: "Shop Website",
      social: true,
      soc_icon: require("../assets/icons/tiktok.png"),
    },
    shop_facebook: {
      value: user.shop_facebook,
      icon: "globe",
      placeholder: "Shop Facebook",
      editable: true,
      label: "Shop Website",
      social: true,
      soc_icon: require("../assets/icons/facebook.png"),
    },
    // social end

    prods: {
      value: "Mes Annonces",
      icon: "globe",
      placeholder: "Mes Annonces ...",
      editable: false,
    },
  };

  return (
    <>
      {Object.entries(shopInfo).map((data, i) => (
        <View key={i}>
          <TouchableOpacity onPress={(e) => handleInfoPress(data)}>
            <View style={[styles.flexRow, styles.justifyBetween, st.shopdt]}>
              <View style={[{ width: 28 }]}>
                {!data[1].social && (
                  <Icon
                    name={data[1].icon || FA_ICONS.def}
                    size={24}
                    style={{ color: KOOP_BLUE }}
                  />
                )}
                {data[1].social && (
                  <Image
                    source={data[1].soc_icon}
                    style={[{ width: 24, height: 24 }]}
                  />
                )}
              </View>
              <View style={[st.hspace]}></View>
              <Text
                numberOfLines={1}
                multiline={false}
                style={[styles.alignSelfStart, st.t, { flexShrink: 1 }]}
              >
                {data[0] === "prod"
                  ? "Products & Services"
                  : data[1].value || (
                      <Text style={[styles.textGray]}>
                        {data[1].placeholder}
                      </Text>
                    )}
              </Text>
              <View style={[st.hspace]}></View>
              {data[1].editable && (
                <View>
                  <Icon name={"edit"} size={24} style={{ color: KOOP_BLUE }} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <MenuButton
        btn={{
          id: 0,
          label: "CHANGE SUBSCRIPTION",
          icon: require("../assets/icons/subscription.png"),
        }}
        handleOnPress={(e) => navigation.navigate("Subscriptions")}
      />
    </>
  );
};

const st = StyleSheet.create({
  fsbg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shopfront: {
    backgroundColor: KOOP_BLUE_DARK,
    height: 220,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  shopfronttitle: {
    fontSize: 20,
  },
  header: {
    backgroundColor: KOOP_BLUE,
    color: "white",
  },
  shopdt: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#99999933",
  },
  hspace: {
    width: 10,
  },
  t: {
    alignSelf: "flex-start",
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,

    backgroundColor: KOOP_BLUE_TRANSLUCIDE,
  },
  cbsubcont: {
    backgroundColor: "white",
    width: 20,
    height: 20,
    borderWidth: 4,
    borderRadius: 10,
    borderColor: "#999",
  },
  cbsub: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bgOn: { backgroundColor: "green" },
  bgOff: { backgroundColor: "#9996" },
  activeSub: {
    borderWidth: 2,
    borderColor: KOOP_BLUE_DARK,
  },
});
