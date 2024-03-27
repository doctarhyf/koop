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

import { UserContext } from "../App";
import { AntDesign } from "@expo/vector-icons";
import styles from "../helpers/styles";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import TextButton from "../components/TextButton";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";

const MEDIA_TYPE_CAMERA = 0;
export default function ProfileAndShopSetup({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [userName, setUserName] = useState("DOCTA RHYF");
  const [businessName, setBusinessName] = useState("DOCTA RHYF's BUSINESS");
  const [profilePic, setProfilePic] = useState(null);
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

    //after setup and login
    /*   setTimeout(() => {
      setuser({ displayName: "doctarhyf" });
      navigation.navigate("Initializing");
    }, 2000); */

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

      setProfilePic(uri);
    }
  };

  const onNext = (e) => {
    if (profilePic === null) {
      Vibration.vibrate(250);
      Alert.alert(
        "Profile picture needed!",
        "Please you need to upoad ap profile pic"
      );
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

    if (userName === "" || businessName === "") {
      seterror(true);

      setTimeout(() => {
        seterror(false);
      }, 3000);
      return;
    }

    const profdata = {
      phone: phone,
      userName: userName,
      businessName: businessName,
      profilePic: profilePic,
    };

    if (hasPromoCode) profdata.invited_with_promo = promoCode;

    navigation.replace("Initializing", profdata);
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
              source={{ uri: profilePic || null }}
            >
              <AntDesign name="camera" size={24} color="gray" />
            </ImageBackground>
          </TouchableOpacity>

          <View style={[styles.flexRow, styles.alignCenter]}>
            <AntDesign name="phone" size={24} color="gray" />
            <View style={[{ width: 10 }]} />
            <Text style={[st.ti, { borderBottomColor: "grey" }]}>{phone}</Text>
          </View>
          <View style={[{ height: 20 }]} />
          <View style={[styles.flexRow, styles.alignCenter]}>
            <AntDesign name="user" size={24} color="gray" />
            <View style={[{ width: 10 }]} />
            <TextInput
              value={userName}
              onChangeText={(txt) => setUserName(txt)}
              style={[st.ti, { borderBottomColor: error ? "red" : "grey" }]}
              placeholderTextColor={error ? "red" : "grey"}
              placeholder={"profile"}
            />
          </View>
          <Text style={[st.selfStart]}>
            Ceci est le nom de votre profil en tant que client
          </Text>
          <View style={[{ height: 20 }]} />
          <View style={[styles.flexRow, styles.alignCenter]}>
            <MaterialCommunityIcons
              name="google-my-business"
              size={24}
              color="black"
            />
            <View style={[{ width: 10 }]} />
            <TextInput
              value={businessName}
              onChangeText={(txt) => setBusinessName(txt)}
              style={[st.ti, { borderBottomColor: error ? "red" : "grey" }]}
              placeholderTextColor={error ? "red" : "grey"}
              placeholder={
                userName && userName.length > 1
                  ? `ex: ${userName.toUpperCase()} BUSINESS `
                  : "business name"
              }
            />
          </View>
          <Text style={[st.selfStart]}>Ceci est le nom de votre Maison </Text>
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
            <Text>I have a promo code</Text>
            <Switch
              trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
              thumbColor={hasPromoCode ? KOOP_BLUE : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(e) => setHasPromoCode((prev) => !prev)}
              value={hasPromoCode}
            />
          </View>
          {hasPromoCode && (
            <View>
              <View style={[styles.flexRow, styles.alignCenter]}>
                <MaterialCommunityIcons name="lock" size={24} color="black" />
                <View style={[{ width: 10 }]} />
                <TextInput
                  value={promoCode}
                  onChangeText={(txt) => setPromoCode(txt)}
                  style={[st.ti, { borderBottomColor: error ? "red" : "grey" }]}
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
