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
  FlatList,
} from "react-native";

import UserContext from "../context/UserContext";
import { AntDesign } from "@expo/vector-icons";
import styles from "../helpers/styles";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import TextButton from "../components/TextButton";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import ShopSetup from "./ShopSetup";
import CustomAlert from "../components/CustomAlert";
import { VILLES } from "../helpers/flow";

const MEDIA_TYPE_CAMERA = 0;

function ProfileSetup({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [display_name, set_display_name] = useState("");

  const [ville, setville] = useState(null);
  const [profile, set_profile] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [error, seterror] = useState(false);
  const { phone } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    return true;
  };

  const handleAddImage = (e) => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const onChooseMedia = (mediaType) => {
    pickImageAsync(mediaType);
  };

  const pickImageAsync = async (mediaType) => {
    closeBottomSheet();
    let result;

    if (mediaType === MEDIA_TYPE_CAMERA) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const { uri } = result.assets[0];

      console.error("new profile pic => ", uri);

      set_profile(uri);
    }
  };

  const onNext = (e) => {
    if (profile === null) {
      Vibration.vibrate(250);
      Alert.alert(
        "Profile picture needed!",
        "Please you need to upoad ap profile pic"
      );
      return;
    }

    if (ville === null || ville.trim() === "") {
      Vibration.vibrate(250);
      Alert.alert("Votre ville?", "Veuillir choisir votre ville svp");
      return;
    }

    if (hasPromoCode && promoCode.trim() === "") {
      Vibration.vibrate(250);
      Alert.alert(
        "Promo code empty",
        "If you have a promo code, type it please!"
      );
      return;
    }

    if (display_name === "") {
      seterror(true);

      setTimeout(() => {
        seterror(false);
      }, 3000);
      return;
    }

    const profileData = {
      phone: phone,
      display_name: display_name,
      // shop_name: shop_name,
      profile: profile,
    };

    if (hasPromoCode && promoCode.trim().length > 0)
      profileData.invited_with_promo = promoCode;

    navigation.replace(ShopSetup.ROUTE, profileData);
  };

  const [showvilles, setshowvilles] = useState(false);
  const showVilleSelector = (e) => {
    setshowvilles(true);
  };

  const handleVillePress = (item) => {
    const ville = item.item;

    setville(ville);
    setshowvilles(false);
  };

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
          <Text style={[st.title]}>
            Creation de votre profil et du profile de votre maison
          </Text>
          <Text>
            Permettre a vos clients d'en savoir plus sur vos services et
            produits offerts
          </Text>
        </View>

        <View style={[styles.flex1, styles.marginMin, styles.alignCenter]}>
          <TouchableOpacity onPress={handleAddImage}>
            <ImageBackground
              style={[st.profile]}
              source={{ uri: profile || null }}
            >
              <AntDesign name="camera" size={24} color="gray" />
            </ImageBackground>
          </TouchableOpacity>

          <View style={[styles.flexRow, styles.alignCenter]}>
            <AntDesign name="phone" size={24} color="gray" />
            <View style={[{ width: 10 }]} />
            <Text
              style={[
                st.ti,
                { borderBottomColor: "grey" },
                styles.paddingSmall,
              ]}
            >
              {phone}
            </Text>
          </View>
          <View style={[{ height: 20 }]} />
          <View style={[styles.flexRow, styles.alignCenter]}>
            <AntDesign name="user" size={24} color="gray" />
            <View style={[{ width: 10 }]} />
            <TextInput
              value={display_name}
              onChangeText={(txt) => set_display_name(txt)}
              style={[
                st.ti,
                { borderBottomColor: error ? "red" : "grey" },
                styles.paddingSmall,
              ]}
              placeholderTextColor={error ? "red" : "grey"}
              placeholder={"Votre nom de profile"}
            />
          </View>
          <Text style={[st.selfStart]}>
            Ceci est le nom de votre profil en tant que client
          </Text>

          <View style={[{ height: 20 }]} />

          <TouchableOpacity onPress={(e) => showVilleSelector()}>
            <View style={[styles.flexRow, styles.alignCenter]}>
              <MaterialCommunityIcons
                name="google-my-business"
                size={24}
                color="black"
              />
              <View style={[{ width: 10 }]} />
              <Text
                style={[
                  ville ? { color: "#000000" } : styles.textBlue,
                  st.ti,
                  { borderBottomColor: "grey" },
                  styles.paddingSmall,
                ]}
              >
                {ville || "Choisissez votre ville"}
              </Text>
            </View>
          </TouchableOpacity>
          {/*  <Text style={[st.selfStart]}>Votre ville </Text> */}

          <CustomAlert
            visible={showvilles}
            onClose={(e) => setshow(false)}
            message={"this is sample message"}
          >
            <View
              style={[
                {
                  backgroundColor: "white",

                  width: "80%",
                  margin: 24,
                  padding: 12,
                  borderRadius: 12,
                  height: 320,
                },
              ]}
            >
              <FlatList
                keyExtractor={(it, i) => i}
                renderItem={(item) => (
                  <TouchableOpacity onPress={(e) => handleVillePress(item)}>
                    <Text
                      style={[
                        {
                          padding: 8,

                          margin: 8,
                        },
                      ]}
                    >
                      {item.item}
                    </Text>
                  </TouchableOpacity>
                )}
                data={VILLES}
              />
            </View>
          </CustomAlert>

          <View style={[{ height: 20 }]} />
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
            <Text style={[{ fontWeight: "bold", marginVertical: 12 }]}>
              I have a promo code
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
              thumbColor={hasPromoCode ? KOOP_BLUE : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(e) => setHasPromoCode((prev) => !prev)}
              value={hasPromoCode}
            />
          </View>
          {hasPromoCode && (
            <View style={[{ marginHorizontal: 14 }]}>
              <View style={[styles.flexRow, styles.alignCenter]}>
                <MaterialCommunityIcons name="lock" size={24} color="black" />
                <View style={[{ width: 10 }]} />
                <TextInput
                  value={promoCode}
                  onChangeText={(txt) => setPromoCode(txt)}
                  style={[
                    st.ti,
                    {
                      padding: 12,
                      width: "80%",
                      borderBottomColor: error ? "red" : "grey",
                    },
                  ]}
                  placeholderTextColor={error ? "red" : "grey"}
                  placeholder={"ex:STARPRO"}
                />
              </View>
              <Text style={[st.selfStart]}>
                Si vous ete invite avec un code promo, veuillez l'inserer SVP{" "}
              </Text>
            </View>
          )}

          {error && (
            <Text style={[st.error]}>
              Profile name and businessName cant be empty
            </Text>
          )}
        </View>

        <TextButton label={"NEXT"} handlePress={onNext} />
        <Modal
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
        </Modal>
      </View>
    </ScrollView>
  );
}

ProfileSetup.ROUTE = "ProfileSetup";

export default ProfileSetup;

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
    width: 120,
    height: 120,
    borderRadius: 60,
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
