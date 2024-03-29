import React, {
  useEffect,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
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
  StatusBar,
} from "react-native";

import { Foundation } from "@expo/vector-icons";
import UserContext from "../context/UserContext";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import styles from "../helpers/styles";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import TextButton from "../components/TextButton";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoEdit from "./InfoEdit";

const MEDIA_TYPE_CAMERA = 0;

const ShopTagsSelector = () => {
  return <Text>Shop tags selector</Text>;
};

function ShopSetup({ navigation, route }) {
  const [error, seterror] = useState(false);
  const [has_shop, set_has_shop] = useState(true);
  let params = route.params;
  const [profileData, setProfileData] = useState({ ...params });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTMP();
    }, [])
  );

  const loadTMP = async () => {
    const dataStr = await AsyncStorage.getItem("tmp");

    const data = JSON.parse(dataStr);

    if (data !== null) {
      const key = data.key;
      const val = data.val;

      setProfileData((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleAddImage = (e) => {
    //setBottomSheetVisible(true);
  };

  const onNext = () => {
    const { shop_profile, shop_add, shop_desc, shop_tags } = profileData;

    alert(JSON.stringify(profileData));
  };

  const onUpdateProfileData = (type, val) => {
    setProfileData((prev) => ({ ...prev, [type]: val }));
  };

  const setShowShopTagsSelctor = () => {
    const cur_shop_tags = {
      value: profileData.shop_tags,
      icon: "tags",
      placeholder: "Shop Tags",
      editable: true,
      label: "Shop Tags",
    };

    navigation.navigate(InfoEdit.ROUTE, ["shop_tags", cur_shop_tags, true]);
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
        <View>
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
          <Text>I have a shop</Text>
          <Switch
            trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
            thumbColor={has_shop ? KOOP_BLUE : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => set_has_shop((prev) => !prev)}
            value={has_shop}
          />
        </View>

        {has_shop && (
          <View>
            <View style={[styles.marginMin, styles.alignCenter]}>
              <TouchableOpacity
                onPress={handleAddImage}
                style={{ width: "90%", marginHorizontal: 40 }}
              >
                <ImageBackground
                  style={[st.profile]}
                  source={{ uri: profileData.shop_profile }}
                >
                  <AntDesign name="camera" size={24} color="gray" />
                </ImageBackground>
              </TouchableOpacity>

              <View style={[{ height: 20 }]} />
              <View style={[styles.flexRow, styles.alignCenter]}>
                <Entypo name="location" size={24} color="black" />
                <View style={[{ width: 10 }]} />
                <TextInput
                  multiline={true}
                  value={profileData.shop_add}
                  onChangeText={(txt) => onUpdateProfileData("shop_add", txt)}
                  style={[
                    st.ti,
                    styles.paddingSmall,
                    { borderBottomColor: error ? "red" : "grey" },
                    ,
                  ]}
                  placeholderTextColor={error ? "red" : "grey"}
                  placeholder={"Shop physicall address"}
                />
              </View>

              <View style={[{ height: 20 }]} />
              <View style={[styles.flexRow, styles.alignCenter]}>
                <Foundation name="torso-business" size={24} color="black" />
                <View style={[{ width: 10 }]} />
                <TextInput
                  multiline={true}
                  value={profileData.shop_desc}
                  onChangeText={(txt) => onUpdateProfileData("shop_desc", txt)}
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

              <View
                style={[
                  styles.flexRow,
                  styles.alignCenter,
                  { marginHorizontal: 12, width: "90%" },
                ]}
              >
                <MaterialCommunityIcons
                  name="google-my-business"
                  size={24}
                  color="black"
                />
                <View style={[{ width: 10 }]} />

                <TouchableOpacity onPress={(e) => setShowShopTagsSelctor()}>
                  <Text style={[styles.paddingSmall]}>Add categories</Text>
                </TouchableOpacity>
              </View>

              <Text style={[st.selfStart]}>
                Selectionnez les differentes categories dans les quelles vous
                oeuvre
              </Text>

              {profileData.shop_tags && profileData.shop_tags.length > 0 && (
                <View style={[st.tagCont]}>
                  {profileData.shop_tags
                    .split(";")
                    .slice(1)
                    .map(
                      (it, i) =>
                        it !== "" && (
                          <Text key={i} style={[st.tag, { fontSize: 10 }]}>
                            {it}
                          </Text>
                        )
                    )}
                </View>
              )}

              <View style={[{ height: 20 }]} />

              {/* 
              {error && (
                <Text style={[st.error]}>
                  Profile name and businessName cant be empty
                </Text>
              )} */}
            </View>
          </View>
        )}

        <TextButton label={"NEXT"} handlePress={onNext} />
        <View style={[{ height: 20 }]} />

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
  tagCont: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    padding: 8,
    margin: 4,

    borderRadius: 16,
    overflow: "hidden",
    flexShrink: 1,

    borderColor: KOOP_BLUE,
    backgroundColor: KOOP_BLUE,

    borderWidth: 1,
    color: "white",
  },
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
    height: 180,
    width: "100%",
    borderRadius: 12,
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
