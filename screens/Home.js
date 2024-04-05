import { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { MAIN_MENU_BUTTONS } from "../helpers/flow";
import { KOOP_BLUE, KOOP_BLUE_TRANSLUCIDE } from "../helpers/colors";
import ModalMenu from "../components/ModalMenu";
import UserContext from "../context/UserContext";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InfoPane = ({ navigation, gotoMyAccount, onCloseInfoPane }) => {
  return (
    <View
      style={[
        st.infpane,
        styles.marginMin,
        styles.flexRow,
        styles.alignCenter,
        { borderRadius: 8, borderColor: "#bbbbbb", borderWidth: 1 },
      ]}
    >
      <View style={[st.store]}>
        <Image
          source={require("../assets/icons/store.png")}
          style={[{ width: 60, height: 60, resizeMode: "contain" }]}
          transition={1000}
        />
      </View>
      <View>
        <Text>Finish setting up your profile and your shop</Text>

        <TouchableOpacity onPress={gotoMyAccount}>
          <Text
            style={[styles.textBlue, styles.paddingSmall, styles.textCenter]}
          >
            My Account
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={(e) => onCloseInfoPane()}
        style={[{ padding: 12 }]}
      >
        <AntDesign name="closecircle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const Home = ({ navigation }) => {
  const { user, setuser } = useContext(UserContext);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isInfoPaneVisible, setIsInfoPaneVisible] = useState(false);

  useEffect(() => {
    const loadInfoPaneVisible = async () => {
      const visible = (await AsyncStorage.getItem("info_pane")) === null;
      setIsInfoPaneVisible(visible);
    };
    loadInfoPaneVisible();
  }, []);

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "KOOP",
      headerStyle: st.header,
      headerTitleStyle: {
        color: "white",
        textAlign: "center",
      },
      headerLeft: () => (
        <View>
          <TouchableOpacity
            onPress={(e) => navigation.navigate("MyAccount", user)}
          >
            <Image
              source={user.profile}
              transition={1000}
              style={[
                {
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  overflow: "hidden",
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={openMenu}>
          <Image
            style={{ width: 30, height: 30, marginRight: 4 }}
            source={require("../assets/icons/menu.png")}
            transition={1000}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  function handleOnPress(btn) {
    navigation.navigate(btn.route);
  }

  const gotoMyAccount = () => {
    navigation.navigate("MyAccount", user);
  };

  const onCloseInfoPane = async () => {
    AsyncStorage.setItem("info_pane", "false");
    setIsInfoPaneVisible(false);
  };

  return (
    <SafeAreaView style={[styles.bgBlue, styles.flex1]}>
      <ScrollView>
        <View>
          {isInfoPaneVisible && (
            <InfoPane
              navigation={navigation}
              gotoMyAccount={gotoMyAccount}
              onCloseInfoPane={onCloseInfoPane}
            />
          )}
          {!isInfoPaneVisible && (
            <View
              style={[styles.flex1, styles.justifyCenter, styles.alignCenter]}
            >
              <Image
                source={require("../assets/koop.png")}
                style={[{ width: 160, height: 120 }]}
              />
            </View>
          )}
          <Image
            style={styles.alignSelfCenter}
            source={require("../assets/koop.png")}
            transition={1000}
          />
          <Text
            style={[
              styles.textWhite,
              styles.fontBold,
              styles.alignSelfCenter,
              { marginVertical: 32 },
            ]}
          >
            {`Hello ${user.display_name}, what would you like to do?`}
          </Text>

          <View
            style={[
              styles.bgWhite,
              styles.bgWhite,
              styles.flex1,
              styles.mtLarge,
              styles.borderTopStartRadius,
              styles.paddingLarge,
              styles.borderTopRadiusLarge,
            ]}
          >
            {MAIN_MENU_BUTTONS.map((btn, i) => (
              <MenuButton key={i} btn={btn} handleOnPress={handleOnPress} />
            ))}

            <Text style={[styles.textCenter, styles.mtLarge]}>
              You can pick weather you are lookig for a service or you wanna
              provide a service
            </Text>
          </View>

          <ModalMenu
            navigation={navigation}
            isMenuVisible={isMenuVisible}
            closeMenu={closeMenu}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const st = StyleSheet.create({
  infpane: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  store: {
    overflow: "hidden",
    marginEnd: 12,
    width: 60,
    height: 60,
    margin: 12,
  },
  header: {
    backgroundColor: KOOP_BLUE,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: KOOP_BLUE_TRANSLUCIDE,
  },
});
