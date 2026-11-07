// In App.js in a new project

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import registerNNPushToken from "native-notify";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DefaultTheme, NavigationContainer as NavContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { colors, headerOptions } from "./theme";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserContext from "./context/UserContext";
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
  { name: "Home", comp: Home, options: { headerShown: false } },
  { name: "Provide", comp: Provide }, //SendMessage
  { name: "SendMessage", comp: SendMessage, options: { title: "New message" } },
  { name: "Look", comp: Look, options: { title: "Discover" } },
  { name: "ViewAll", comp: ViewAll },
  { name: "MyAccount", comp: MyAccount, options: { title: "My account" } },
  { name: "Inbox", comp: Inbox, options: { title: "Messages" } },
  { name: "MyItems", comp: MyItems },
  { name: "Settings", comp: Settings },
  { name: "Other", comp: Other, options: { title: "More services" } },
  { name: "Shop", comp: Shop },
  { name: "Popular", comp: Popular },
  { name: "GPS", comp: Localisation },
  { name: "Request", comp: Request },
  { name: "InfoEdit", comp: InfoEdit },
  { name: "ServiceInfo", comp: ServiceInfo },
  { name: "Search", comp: Search, options: { title: "Browse" } },
  { name: "Test", comp: Test },
  { name: ProfileSetup.ROUTE, comp: ProfileSetup },
  { name: "Comments", comp: Comments },
  { name: "ViewMessage", comp: ViewMessage },
  { name: "Explore", comp: Explore },
  { name: "About", comp: About },
  { name: "ContactUs", comp: ContactUs },
  { name: "ChangePIN", comp: ChangePIN },
  { name: ShopSetup.ROUTE, comp: ShopSetup, options: { title: "Inscription", headerBackVisible: false } },
  {
    name: ServiceRequest.ROUTE,
    comp: ServiceRequest,
    options: { title: "Nouvelle annonce" },
  },
  { name: "ViewServiceRequest", comp: ViewServiceRequest },
  { name: "PaymentResult", comp: PaymentResult },
  { name: "FirstPage", comp: FirstPage, options: { headerShown: false } },
  { name: "PremiumSubscriptions", comp: PremiumSubscriptions },
];

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync().catch(() => {});

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  registerNNPushToken(20602, "b4XsCQJJ9vzPICDZTpbPuy");

  const [user, setuser] = useState(null);
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const onLayout = useCallback(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={onLayout}>
      <StatusBar style="dark" />
      <UserContext.Provider value={{ user, setuser }}>
        <RootSiblingParent>
          <NavContainer theme={navTheme}>
            <Stack.Navigator
              initialRouteName={"FirstPage"}
              screenOptions={headerOptions}
            >
              {SCREENS.map((scr, i) => (
                <Stack.Screen
                  key={i}
                  name={scr.name}
                  component={scr.comp}
                  options={scr.options}
                />
              ))}
            </Stack.Navigator>
          </NavContainer>
        </RootSiblingParent>
      </UserContext.Provider>
      </View>
    </SafeAreaProvider>
  );
}
