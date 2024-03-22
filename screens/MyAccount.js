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
import { Picker } from "@react-native-picker/picker";
import styles from "../helpers/styles";
import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_LIGHT,
  KOOP_BLUE_TRANSLUCIDE,
  KOOP_GREEN,
} from "../helpers/colors";
import MenuButton from "../components/MenuButton";
import { UserContext } from "../App";
import { UPDATE_SUCCESS, updateUserData } from "../utils/db";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import usePicURL from "../hooks/usePicURL";
import TextButton from "../components/TextButton";
import { FontAwesome } from "@expo/vector-icons";
import { editable } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";
import ProfileUploader from "../components/ProfileUploader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabPersonalInfo from "../components/TabPersonalInfo";
import TabShopInfo from "../components/TabShopInfo";

const INPUTS = [
  { ph: "Name", dataName: "fullName" }, //ph for placeholder
  { ph: "Displayname", dataName: "displayName" },
  {
    ph: "Email",
    dataName: "email",
    options: { keyboardType: "email-address", autoCapitalize: "none" },
  },
  { ph: "DOB", dataName: "dob" },
  {
    ph: "Ville",
    dataName: "ville",
    data: ["KINSHASA", "LUBUMBASHI", "LIKASI", "KOLWEZI"],
  },
];

const FA_ICONS = {
  name: "user",
  tags: "tags",
  desc: "align-right",
  add: "location-arrow",
  email: "envelope",
  web: "globe",
  servicesIDs: "",
  def: "coffee",
};

const TAB = {
  PERSONAL_INFO: 0,
  SHOP_INFO: 1,
};

const HeaderShopInfo = ({ user, setuser, handleBGUpdatePress }) => {
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const onProfilePicUri = async (uri) => {
    const upd = { shop_profile: uri };
    await updateUserData(user.id, upd);
    console.error("shop bg uri => ", uri);
    const newUserData = { ...user, shop_profile: uri };
    setuser(newUserData);
    await AsyncStorage.setItem("@KOOP:user", JSON.stringify(newUserData));
    console.error("upd usr new user => ", newUserData);
  };

  const bg =
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D";

  return (
    <View style={[st.shopfront]}>
      <Image source={{ uri: user.shop_profile || bg }} style={[st.fsbg]} />
      <View style={[{ padding: 10 }, styles.justifyCenter, styles.alignCenter]}>
        <Text style={[st.shopfronttitle, styles.textWhite, styles.textCenter]}>
          {user.shop_name.toUpperCase() || "MY SHOP"}
        </Text>
      </View>

      <ProfileUploader
        onProfilePicUri={onProfilePicUri}
        currentURI={user.shop_profile}
        setUpdatingProfile={setUpdatingProfile}
      />
      <ActivityIndicator animating={updatingProfile} color={KOOP_BLUE} />
    </View>
  );
};

export default function MyAccount({ navigation }) {
  const [tab, settab] = useState(0);
  const { user, setuser } = useContext(UserContext);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [loading, setloading] = useState(false);

  const handleBGUpdatePress = (e) => {};

  const handleInfoPress = (data) => {
    if (data[0] === "prods") {
      navigation.navigate("MyServices");
      return;
    }

    const editable = data[1].editable;

    if (editable === false || editable === undefined) {
      return;
    }

    navigation.navigate("InfoEdit", data);
  };

  const handleProfileChange = async (uri) => {
    console.error("will update new profile => ", uri);
    const upd = { profile: uri };
    console.error("new user dt to upd => \n", upd);

    const res = await updateUserData(user.id, upd);

    if (res.length === 1) {
      const newUserData = res[0];

      setuser(newUserData);
      await AsyncStorage.setItem("@KOOP:user", JSON.stringify(newUserData));
      console.error("upd usr new user => ", newUserData);
    } else {
      console.error("Error updating user => ");
    }
  };

  return (
    <ScrollView style={[styles.bgWhite]}>
      <View style={[st.modalContainer, styles.flex1, styles.marginBottomXXL]}>
        {tab === TAB.PERSONAL_INFO && (
          <View style={[styles.paddingMid]}>
            <View
              style={[
                styles.flexRow,
                styles.justifyBetween,
                styles.alignCenter,
              ]}
            >
              <TouchableOpacity
                onPress={(e) =>
                  navigation.navigate("PhotoViewer", user.profile)
                }
                onLongPress={handleProfileChange}
              >
                <ImageBackground
                  source={{
                    uri:
                      user.profile ||
                      "https://avatars.githubusercontent.com/u/5081332?v=4",
                  }}
                  style={[
                    {
                      width: 100,
                      height: 100,
                      backgroundColor: "red",
                      borderRadius: 50,
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  {updatingProfile ? (
                    <ActivityIndicator
                      animating={updatingProfile}
                      color={KOOP_BLUE}
                    />
                  ) : (
                    <ProfileUploader
                      setUpdatingProfile={setUpdatingProfile}
                      currentURI={user.profile}
                      onProfilePicUri={handleProfileChange}
                    />
                  )}
                </ImageBackground>
              </TouchableOpacity>
              <View style={[styles.flexRow, styles.justifyBetween]}>
                <View style={[styles.marginRightLarge]}>
                  <Text style={styles.textWhite}>ACC. STATS</Text>
                  <Text style={[st.active]}>Active</Text>
                </View>
                <View>
                  <Text style={styles.textWhite}>SUBSCR. END</Text>
                  <Text>30/06/2024</Text>
                </View>
              </View>
            </View>

            <View style={[styles.alignCenter]}>
              <Text style={[styles.textLarge, styles.textWhite]}>
                {user.display_name}
              </Text>
              <Text style={[styles.textBold, { fontSize: 18 }]}>
                {user.phone}
              </Text>
            </View>

            <ActivityIndicator animating={loading} color={"white"} />
          </View>
        )}

        {tab === TAB.SHOP_INFO && (
          <HeaderShopInfo
            user={user}
            setuser={setuser}
            handleBGUpdatePress={handleBGUpdatePress}
          />
        )}

        <View
          style={[
            {
              marginBottom: -30,
            },
            styles.borderTopRadiusLarge,

            styles.flexRow,
          ]}
        >
          {[{ label: "Personal Info" }, { label: "Shop Info" }].map((it, i) => (
            <TouchableOpacity key={i} onPress={(e) => settab(i)}>
              <View
                style={[
                  {
                    backgroundColor: i === tab ? KOOP_BLUE_DARK : "#0000",
                    paddingTop: 20,
                    paddingHorizontal: 20,
                    paddingBottom: 40,
                  },
                  styles.paddingHorizontal,
                  styles.borderTopRadiusLarge,
                ]}
              >
                <Text style={i === tab ? styles.textWhite : []}>
                  {it.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.paddingMid,
            styles.bgWhite,
            styles.borderTopRadiusLarge,
          ]}
        >
          {tab === TAB.PERSONAL_INFO && (
            <TabPersonalInfo
              user={user}
              navigation={navigation}
              handleInfoPress={handleInfoPress}
            />
          )}

          {tab === TAB.SHOP_INFO && (
            <TabShopInfo
              user={user}
              navigation={navigation}
              handleInfoPress={handleInfoPress}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  active: {
    backgroundColor: KOOP_GREEN,
    padding: 4,
    textAlign: "center",
    marginVertical: 4,
    color: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
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
    backgroundColor: "black",
    padding: 12,
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
