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
} from "react-native";
import { UserContext } from "../App";
import { KOOP_BLUE } from "../helpers/colors";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { IMG_SIZE } from "../helpers/flow";

const ICON_SIZE = 24;

const DATA = [
  {
    title: "Settings",
    data: [
      {
        text: "Change PIN",
        icon: <Entypo name="lock" size={ICON_SIZE} color="black" />,
      },
      {
        text: "Face ID",
        icon: <FontAwesome6 name="face-grin-wide" size={24} color="black" />,
      },
    ],
  },
  {
    title: "Help and contact",
    data: [
      {
        text: "Share the app",
        icon: <Octicons name="share" size={24} color="black" />,
      },
      {
        text: "Contact us",
        icon: <FontAwesome6 name="smile-wink" size={24} color="black" />,
      },
      {
        text: "About",
        icon: <Entypo name="info-with-circle" size={24} color="black" />,
      },
    ],
  },
];

export default Settings = () => {
  const { user, setuser } = useContext(UserContext);

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
          <View>
            <Text style={[st.sec_title]}>{section.title}</Text>
            {section.data.map((it, i) => (
              <View style={[st.it_cont]}>
                <View style={[st.it_icon]}>{it.icon}</View>
                <Text>{it.text}</Text>
              </View>
            ))}
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
    alignContent: "center",
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  it_text: { marginLeft: 12 },
});
