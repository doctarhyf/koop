import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from "react-native";
import UserContext from "../context/UserContext";
import { KOOP_BLUE } from "../helpers/colors";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { IMG_SIZE } from "../helpers/flow";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ICON_SIZE = 24;

const DATA = [
  {
    title: "Settings",
    data: [
      {
        text: "Change PIN",
        icon: <Entypo name="lock" size={ICON_SIZE} color="black" />,
        route: "change_pin",
      },
      {
        text: "Face ID",
        icon: <FontAwesome6 name="face-grin-wide" size={24} color="black" />,
        route: "face_id",
        os: "ios",
      },
    ],
  },
  {
    title: "Help and contact",
    data: [
      {
        text: "Share the app",
        icon: <Octicons name="share" size={24} color="black" />,
        route: "share_app",
      },
      {
        text: "Terms & Conditions",
        icon: <FontAwesome5 name="file-contract" size={24} color="black" />,
        route: "terms_and_cond",
      },
      {
        text: "Contact us",
        icon: <FontAwesome6 name="smile-wink" size={24} color="black" />,
        route: "contact_us",
      },
      {
        text: "Sign out",
        icon: <Octicons name="sign-out" size={24} color="black" />,
        route: "signout",
      },
      ,
      {
        text: "About",
        icon: <Entypo name="info-with-circle" size={24} color="black" />,
        route: "about",
      },
    ],
  },
];

export default Settings = ({ navigation, route }) => {
  const { user, setuser } = useContext(UserContext);

  const shareLink = async () => {
    try {
      const applink = "https://konext.app/";
      const result = await Share.share({
        message: `Salut ! 👋 Je voulais te faire découvrir cette superbe application que j'utilise en ce moment. Elle s'appelle KOOP, et elle m'a été incroyablement utile pour trouver des clients et des articles rares. Tu peux la télécharger gratuitement sur l'App Store/Google Play : ${applink}. N'hésite pas à l'essayer et à me faire part de ton avis ! 😊 #KOOP #KOOP2024.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onSettingsPress = (settings) => {
    const { route } = settings;

    if (route === "about") navigation.navigate("About");

    if (route === "contact_us") navigation.navigate("ContactUs");

    if (route === "change_pin")
      navigation.navigate("ChangePIN", { user: user, setuser: setuser });

    if (route === "terms_and_cond")
      navigation.navigate("TOS", { user: user, setuser: setuser });

    if (route === "share_app") {
      shareLink();
    }

    if (route === "signout") {
      Alert.alert("Sign out", "Are you sure you wanna sign out?", [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            signout();
          },
        },
      ]);
    }
  };

  const signout = async () => {
    await AsyncStorage.removeItem("@KOOP:user");

    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={[st.container, { flex: 1 }]}>
      <ImageBackground
        style={[st.head]}
        source={require("../assets/icons/settings_2.png")}
      >
        <Text style={[{ fontSize: 14 }]}>{user.display_name}</Text>
        <Text style={[{ fontSize: 18, fontWeight: "bold" }]}>{user.phone}</Text>
      </ImageBackground>

      <ScrollView style={[{ padding: 12 }]}>
        {DATA.map((section, isec) => (
          <View key={isec}>
            <Text style={[st.sec_title]}>{section.title}</Text>
            {section.data.map((it, i) =>
              it.os ? (
                Platform.OS === it.os ? (
                  <TouchableOpacity
                    key={i}
                    onPress={(e) => onSettingsPress(it)}
                  >
                    <View style={[st.it_cont]}>
                      <View style={[st.it_icon]}>{it.icon}</View>
                      <Text>{it.text}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              ) : (
                <TouchableOpacity key={i} onPress={(e) => onSettingsPress(it)}>
                  <View style={[st.it_cont]}>
                    <View style={[st.it_icon]}>{it.icon}</View>
                    <Text>{it.text}</Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  container: {
    padding: 8,
  },
  head: {
    height: 180,
    padding: 8,
    resizeMode: "center",
  },
  sec_title: { color: "#666", fontWeight: "bold" },
  it_icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 12,
  },
  it_cont: {
    flexDirection: "row",
    justifyContent: "flex-start",

    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  it_text: { marginLeft: 12 },
});
