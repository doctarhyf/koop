// In App.js in a new project

import React, { useContext, useState, useEffect, createContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // You may need to install a library for icons

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Provide from "./screens/Provide";
import Look from "./screens/Look";
import Other from "./screens/Other";
import Shop from "./screens/Shop";
import Request from "./screens/Request";
import { KOOP_BLUE } from "./helpers/colors";
import { RootSiblingParent } from "react-native-root-siblings";
import Popular from "./screens/Popular";
import MyAccount from "./screens/MyAccount";
import Inbox from "./screens/Inbox";
import MyServices from "./screens/MyServices";
import InfoEdit from "./screens/InfoEdit";
import Settings from "./screens/Settings";
import Subscriptions from "./screens/Subscriptions";
import { supabase } from "./utils/supabase";
import Localisation from "./screens/Localisation";
import ServiceInfo from "./screens/ServiceInfo";
import Search from "./screens/Search";
import Test from "./screens/Test";
import TOS from "./screens/TOS";
import PhotoViewer from "./screens/PhotoViewer";
import Initializing from "./screens/Initializing";
import ProfileAndShopSetup from "./screens/ProfileAndShopSetup";
import Comments from "./screens/Comments";
import ViewAll from "./screens/ViewAll";
import SendMessage from "./screens/SendMessage";
import ViewMessage from "./screens/ViewMessage";

const SCREENS = [
  { name: "Login", comp: Login, options: { headerShown: false } },
  { name: "PhotoViewer", comp: PhotoViewer },
  { name: "Initializing", comp: Initializing },
  { name: "TOS", comp: TOS },
  { name: "Subscriptions", comp: Subscriptions },
  {
    name: "Home",
    comp: Home,
    options: {
      title: "KOOP",
      headerTitleAlign: "center",
    },
  },
  { name: "Provide", comp: Provide }, //SendMessage
  { name: "SendMessage", comp: SendMessage },
  { name: "Look", comp: Look },
  { name: "ViewAll", comp: ViewAll },
  { name: "MyAccount", comp: MyAccount },
  { name: "Inbox", comp: Inbox },
  { name: "MyServices", comp: MyServices },
  { name: "Settings", comp: Settings },
  { name: "Other", comp: Other },
  { name: "Shop", comp: Shop },
  { name: "Popular", comp: Popular },
  { name: "GPS", comp: Localisation },
  { name: "Request", comp: Request },
  { name: "InfoEdit", comp: InfoEdit },
  { name: "ServiceInfo", comp: ServiceInfo },
  { name: "Search", comp: Search },
  { name: "Test", comp: Test },
  { name: "ProfileAndShopSetup", comp: ProfileAndShopSetup },
  { name: "Comments", comp: Comments },
  { name: "ViewMessage", comp: ViewMessage },
];

const Stack = createNativeStackNavigator();
export const UserContext = createContext();

function App() {
  const [user, setuser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setuser }}>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {SCREENS.map((scr, i) => (
              <Stack.Screen
                key={i}
                name={scr.name}
                component={scr.comp}
                options={scr.options}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </UserContext.Provider>
  );
}

export default App;
