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
        icon: (
          <Image
            source={require("../assets/icons/faceid.svg")}
            style={{ width: 24 }}
          />
        ),
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

const SettingsSection = (sectionData) => {
  const { title, data } = sectionData;

  return <Text>{JSON.stringify(sectionData.sectionData.sectionData)}</Text>;

  /* return true ? (
    <Text>{JSON.stringify(sectionData)}</Text>
  ) : (
    <View>
      <Text style={[st.sec_title]}>{title}</Text>
      {data.map((it, i) => (
        <View key={i} style={[st.it_cont]}>
          {it.icon}
          <Text style={[st.it_text]}>{it.text}</Text>
        </View>
      ))}
    </View>
  ); */
};

export default Settings = () => {
  const { user, setuser } = useContext(UserContext);

  return (
    <SafeAreaView style={st.container}>
      <ImageBackground style={[st.head]}>
        <Text>{user.display_name}</Text>
        <Text>{user.phone}</Text>
      </ImageBackground>
      <ScrollView>
        {DATA.map((sec, i) => (
          <SettingsSection key={i} sectionData={sec} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  sec_title: {},
  it_icon: { width: ICON_SIZE, height: ICON_SIZE },
  it_cont: {},
  it_text: {},
});
