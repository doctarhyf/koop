// In App.js in a new project

import React, { useContext, useState, useEffect } from "react";
import "./ignoreWarning";
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
import MyItems from "./screens/MyItems";
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
import ProfileSetup from "./screens/ProfileSetup";
import Comments from "./screens/Comments";
import ViewAll from "./screens/ViewAll";
import SendMessage from "./screens/SendMessage";
import ViewMessage from "./screens/ViewMessage";
import Explore from "./screens/Explore";
import About from "./screens/About";
import ContactUs from "./screens/ContactUs";
import ChangePIN from "./screens/ChangePIN";
import ShopSetup from "./screens/ShopSetup";
import ServiceRequest from "./screens/ServiceRequest";
import PaymentResult from "./screens/PaymentResult";
import ViewServiceRequest from "./screens/ViewServiceRequest";
import registerNNPushToken from "native-notify";

const SCREENS = [
  { name: "Login", comp: Login, options: { headerShown: false } },
  { name: "PhotoViewer", comp: PhotoViewer },
  { name: Initializing.ROUTE, comp: Initializing },
  { name: "TOS", comp: TOS, options: { title: "Terms and Conditions" } },
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
  { name: "MyItems", comp: MyItems },
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
  { name: ProfileSetup.ROUTE, comp: ProfileSetup },
  { name: "Comments", comp: Comments },
  { name: "ViewMessage", comp: ViewMessage },
  { name: "Explore", comp: Explore },
  { name: "About", comp: About },
  { name: "ContactUs", comp: ContactUs },
  { name: "ChangePIN", comp: ChangePIN },
  { name: ShopSetup.ROUTE, comp: ShopSetup, options: { title: "Shop setup" } },
  {
    name: ServiceRequest.ROUTE,
    comp: ServiceRequest,
    options: { title: "Nouvelle Annonce" },
  },
  { name: "ViewServiceRequest", comp: ViewServiceRequest },
  { name: "PaymentResult", comp: PaymentResult },
];

const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(20602, "b4XsCQJJ9vzPICDZTpbPuy");

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
