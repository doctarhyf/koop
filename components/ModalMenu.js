import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "../helpers/styles";
import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_TRANSLUCIDE,
} from "../helpers/colors";
import { Image } from "expo-image";
import UserContext from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import usePicURL from "../hooks/usePicURL";

const MAIN_MENU_ITEMS = [
  { icon: require("../assets/rhyf.png"), label: "My Accout" },
  { icon: require("../assets/icons/chat.png"), label: "Inbox" },
  { icon: require("../assets/icons/post.png"), label: "Mes Annonces" },
  { icon: require("../assets/icons/settings.png"), label: "Settings" },
  // { icon: require("../assets/icons/lab.png"), label: "Test" },
];

const MAIN_MENU_ROUTES = {
  0: "MyAccount",
  1: "Inbox",
  2: "MyItems",
  //3: "Subscriptions",
  3: "Settings",
  4: "Test",
};

export default function ModalMenu({ navigation, isMenuVisible, closeMenu }) {
  const { user, setuser } = useContext(UserContext);
  //const [loadingPic, picUrl] = usePicURL(user.profile);

  const onPressBtn = async (btn) => {
    const { id } = btn;

    //alert(id);

    closeMenu();

    if (id === 6) {
      console.log(id);
      return;
    }

    if (id === -1) {
      await AsyncStorage.removeItem("@KOOP:user", (e) => {
        console.error("async user data deleted!");
        navigation.navigate("Login");
      });

      return;
    }

    MAIN_MENU_ROUTES[id] ? navigation.navigate(MAIN_MENU_ROUTES[id]) : null;
  };

  return (
    <Modal visible={isMenuVisible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={(e) => closeMenu()}>
        <View
          style={[
            styles.flex1,
            styles.paddingLarge,
            { backgroundColor: "#000d" },
            styles.bgBlue,
          ]}
        >
          <Pressable onPress={(e) => closeMenu()}>
            <Image
              source={require("../assets/koop.png")}
              style={{ height: 120 }}
              transition={1000}
              contentFit="contain"
            />
          </Pressable>

          {MAIN_MENU_ITEMS.map((menu, i) => (
            <View key={i} style={[{ with: "50%" }, styles.roundedMd]}>
              <TouchableOpacity onPress={(e) => onPressBtn({ id: i })}>
                <View
                  style={[
                    styles.flexRow,
                    styles.alignCenter,
                    styles.paddingSmall,
                  ]}
                >
                  <Image
                    source={i === 0 ? { uri: user.profile } : menu.icon}
                    style={[
                      {
                        marginRight: 12,
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                      },
                      styles.overflowHidden,
                    ]}
                  />

                  <Text>{menu.label}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const st = StyleSheet.create({
  header: {
    backgroundColor: KOOP_BLUE,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    backgroundColor: KOOP_BLUE_TRANSLUCIDE,
  },
  spacer: {
    height: 10,
    borderBottomColor: KOOP_BLUE_DARK,
    borderBottomWidth: 1,
  },
});
