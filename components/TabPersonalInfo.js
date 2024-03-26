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

export default TabPersonalInfo = ({ user, handleInfoPress, navigation }) => {
  const { full_name, display_name, phone, pin, dob, email, ville } = user;

  const personalInfo = {
    full_name: {
      value: full_name,
      icon: "user",
      placeholder: "Full Name",
      editable: true,
      label: "Full Name",
    },
    display_name: {
      value: display_name,
      icon: "user-circle-o",
      placeholder: "Website",
      editable: true,
      label: "Display Name",
    },
    /*  phone: {
      value: phone,
      icon: "phone",
      placeholder: "Phone Number",
      editable: false,
      label: "Business Name",
    },
    pin: {
      value: pin,
      icon: "lock",
      placeholder: "PIN",
      editable: true,
      label: "PIN",
    }, */
    dob: {
      value: dob,
      icon: "calendar",
      placeholder: "Birthday",
      editable: true,
      label: "Birthday",
    },
    email: {
      value: email,
      icon: "envelope",
      placeholder: "Email address",
      editable: true,
      label: "Email",
    },
    ville: {
      value: ville,
      icon: "globe",
      placeholder: "Ville",
      editable: true,
      label: "Ville",
    },
  };

  return (
    <View>
      {Object.entries(personalInfo).map((data, i) => (
        <View key={i}>
          <TouchableOpacity onPress={(e) => handleInfoPress(data)}>
            <View
              style={[
                styles.flexRow,
                styles.justifyBetween,
                styles.alignCenter,
                st.shopdt,
              ]}
            >
              <View style={[{ width: 28 }]}>
                <Icon
                  name={data[1].icon || FA_ICONS.def}
                  size={24}
                  style={{ color: KOOP_BLUE }}
                />
              </View>
              <View style={[st.hspace]}></View>
              <Text style={[styles.alignSelfStart, st.t]}>
                {data[1].value || (
                  <Text style={[styles.textGray]}>{data[1].placeholder}</Text>
                )}
              </Text>

              <View style={[st.hspace]}></View>
              {data[1].editable === true && (
                <View>
                  <Icon name={"edit"} size={24} style={{ color: KOOP_BLUE }} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
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
