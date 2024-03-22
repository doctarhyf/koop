import { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";

import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { BUTTONS } from "../helpers/flow";
import { KOOP_BLUE, KOOP_BLUE_TRANSLUCIDE } from "../helpers/colors";
import ModalMenu from "../components/ModalMenu";
import { UserContext } from "../App";
import usePicURL from "../hooks/usePicURL";
import TextButton from "../components/TextButton";

const InfoPane = ({ navigation, gotoMyAccount }) => {
  return (
    <View style={[st.infpane]}>
      <View style={[st.store]}>
        <Image
          source={require("../assets/icons/store.png")}
          style={[{ width: 60, height: 60, resizeMode: "contain" }]}
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
    </View>
  );
};

const Home = ({ navigation }) => {
  const { user, setuser } = useContext(UserContext);
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {}, []);

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
              source={{
                uri: user.profile,
              }}
              style={[
                {
                  backgroundColor: "red",
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
            style={{ width: 30, height: 30, marginRight: 12 }}
            source={require("../assets/icons/menu.png")}
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

  return (
    <SafeAreaView style={[styles.bgBlue, styles.flex1]}>
      <InfoPane navigation={navigation} gotoMyAccount={gotoMyAccount} />
      <Image
        style={styles.alignSelfCenter}
        source={require("../assets/koop.png")}
      />
      <Text style={[styles.textWhite, styles.fontBold, styles.alignSelfCenter]}>
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
        {BUTTONS.map((btn, i) => (
          <MenuButton key={i} btn={btn} handleOnPress={handleOnPress} />
        ))}

        <Text style={[styles.textCenter, styles.mtLarge]}>
          You can pick weather you are lookig for a service or you wanna provide
          a service
        </Text>
      </View>

      <ModalMenu
        navigation={navigation}
        isMenuVisible={isMenuVisible}
        closeMenu={closeMenu}
      />
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
