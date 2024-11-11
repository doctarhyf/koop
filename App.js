// In App.js in a new project

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import registerNNPushToken from "native-notify";
import React, { useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import "./ignoreWarning";
import About from "./screens/About";
import ChangePIN from "./screens/ChangePIN";
import Comments from "./screens/Comments";
import ContactUs from "./screens/ContactUs";
import Explore from "./screens/Explore";
import FirstPage from "./screens/FirstPage";
import Home from "./screens/Home";
import Inbox from "./screens/Inbox";
import InfoEdit from "./screens/InfoEdit";
import Initializing from "./screens/Initializing";
import Localisation from "./screens/Localisation";
import Login from "./screens/Login";
import Look from "./screens/Look";
import MyAccount from "./screens/MyAccount";
import MyItems from "./screens/MyItems";
import Other from "./screens/Other";
import PaymentResult from "./screens/PaymentResult";
import PhotoViewer from "./screens/PhotoViewer";
import Popular from "./screens/Popular";
import PremiumSubscriptions from "./screens/PremiumSubscriptions";
import ProfileSetup from "./screens/ProfileSetup";
import Provide from "./screens/Provide";
import Request from "./screens/Request";
import Search from "./screens/Search";
import SendMessage from "./screens/SendMessage";
import ServiceInfo from "./screens/ServiceInfo";
import ServiceRequest from "./screens/ServiceRequest";
import Settings from "./screens/Settings";
import Shop from "./screens/Shop";
import ShopSetup from "./screens/ShopSetup";
import Subscriptions from "./screens/Subscriptions";
import Test from "./screens/Test";
import TOS from "./screens/TOS";
import ViewAll from "./screens/ViewAll";
import ViewMessage from "./screens/ViewMessage";
import ViewServiceRequest from "./screens/ViewServiceRequest";

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
  { name: "Look", comp: Look, options: { title: "Welcome to KOOP" } },
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
  { name: "FirstPage", comp: FirstPage },
  { name: "PremiumSubscriptions", comp: PremiumSubscriptions },
];

const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(20602, "b4XsCQJJ9vzPICDZTpbPuy");

  const tabs = false;
  const [user, setuser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setuser }}>
      <RootSiblingParent>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={"FirstPage"}>
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
