import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import {
  Text,
  BackHandler,
  Alert,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  Vibration,
  Switch,
} from "react-native";

import UserContext from "../context/UserContext";
import { AntDesign } from "@expo/vector-icons";
import styles from "../helpers/styles";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import TextButton from "../components/TextButton";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";

const MEDIA_TYPE_CAMERA = 0;

function ShopSetup({ navigation, route }) {
  const [error, seterror] = useState(false);
  const [hasShop, setHasShop] = useState(true);
  let params = route.params;
  const [profileData, setProfileData] = useState({ ...params });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    alert(JSON.stringify(params));

    //navigation.replace(Initializing.ROUTE, profdata);
  }, []);

  const handleAddImage = (e) => {
    //setBottomSheetVisible(true);
  };

  const onNext = () => {};

  return (
    <ScrollView>
      <View
        style={[
          styles.justifyCenter,
          styles.alignCenter,
          styles.flex1,
          styles.paddingMid,
        ]}
      >
        <View style={[{ marginBottom: 60 }]}>
          <Text style={[st.title]}>Creation du profile de votre business</Text>
          <Text>
            Permettre a vos clients d'en savoir plus sur vos services et
            produits offerts
          </Text>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            },
          ]}
        >
          <Text>I dont have a shop</Text>
          <Switch
            trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
            thumbColor={hasShop ? KOOP_BLUE : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => setHasShop((prev) => !prev)}
            value={hasShop}
          />
        </View>

        {hasShop && (
          <View>
            <View style={[styles.flex1, styles.marginMin, styles.alignCenter]}>
              <TouchableOpacity onPress={handleAddImage}>
                <ImageBackground
                  style={[st.profile]}
                  source={{ uri: profileData.shop_profile }}
                >
                  <AntDesign name="camera" size={24} color="gray" />
                </ImageBackground>
              </TouchableOpacity>

              <View style={[{ height: 20 }]} />
              <View style={[styles.flexRow, styles.alignCenter]}>
                <AntDesign name="user" size={24} color="gray" />
                <View style={[{ width: 10 }]} />
                <TextInput
                  multiline={true}
                  numberOfLines={6}
                  value={profileData.desc}
                  onChangeText={(txt) => onUpdateProfileData("desc", txt)}
                  style={[
                    st.ti,
                    { borderBottomColor: error ? "red" : "grey" },
                    styles.paddingSmall,
                  ]}
                  placeholderTextColor={error ? "red" : "grey"}
                  placeholder={"Shop description"}
                />
              </View>
              <Text style={[st.selfStart]}>
                Ceci est un message de bienvenue de que vos clients verons sur
                la page de profile de votre maison
              </Text>
              <View style={[{ height: 20 }]} />
              <View style={[styles.flexRow, styles.alignCenter]}>
                <MaterialCommunityIcons
                  name="google-my-business"
                  size={24}
                  color="black"
                />
                <View style={[{ width: 10 }]} />

                <TouchableOpacity onPress={(e) => console.log(e)}>
                  <Text
                    style={[
                      st.ti,
                      { borderBottomColor: error ? "red" : "grey" },
                      styles.paddingSmall,
                    ]}
                  >
                    Categories
                  </Text>
                </TouchableOpacity>

                {/* <TextInput
              value={businessName}
              onChangeText={(txt) => setBusinessName(txt)}
              style={[
                st.ti,
                { borderBottomColor: error ? "red" : "grey" },
                styles.paddingSmall,
              ]}
              placeholderTextColor={error ? "red" : "grey"}
              placeholder={
                userName && userName.length > 1
                  ? `ex: ${userName.toUpperCase()} BUSINESS `
                  : "business name"
              }
            /> */}
              </View>
              <Text style={[st.selfStart]}>
                Selectionnez les differentes categories dans les quelles vous
                oeuvrez{" "}
              </Text>
              <View style={[{ height: 20 }]} />

              {/* 
          {error && (
            <Text style={[st.error]}>
              Profile name and businessName cant be empty
            </Text>
          )} */}
            </View>

            <TextButton label={"NEXT"} handlePress={onNext} />
          </View>
        )}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={bottomSheetVisible}
          onRequestClose={closeBottomSheet}
        >
          <View style={bs.modalContainer}>
            <View style={bs.bottomSheet}>
              <Text>Choose media source</Text>
              {[
                {
                  label: "Camera",
                  icon: require("../assets/icons/camera.png"),
                },
                {
                  label: "Gallery",
                  icon: require("../assets/icons/gallery.png"),
                },
              ].map((btn, i) => (
                <MenuButton
                  key={i}
                  btn={{ ...btn, id: i }}
                  handleOnPress={(e) => onChooseMedia(i)}
                />
              ))}
            </View>
          </View>
        </Modal> */}
      </View>
    </ScrollView>
  );
}

ShopSetup.ROUTE = "ShopSetup";

export default ShopSetup;

const st = StyleSheet.create({
  error: {
    backgroundColor: "red",
    color: "white",
    fontSize: 11,
    padding: 8,
    margin: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 32,
  },
  profile: {
    backgroundColor: "#ddd",
    width: "100%",
    height: 120,

    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  ti: {
    borderBottomWidth: 1,
    width: "80%",
  },
  selfStart: {
    alignSelf: "flex-start",
  },
});

const bs = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 16,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
  },
});
