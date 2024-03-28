import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { blurhash } from "../utils/const";
import { KOOP_BLUE, WHITE } from "../helpers/colors";
import { DIAPO_PICS, BIG_FONT_SIZE, IMG_SIZE } from "../helpers/flow";

import * as FUNCS from "../helpers/funcs";
import { SliderBox } from "react-native-image-slider-box";
import { TABLE_NAMES, supabase } from "../utils/supabase";
import { getItemByRowEqVal, getUser } from "../utils/db";
import * as API from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserContext from "../context/UserContext";

const phoneNumberPattern = /^\d{10}$/;
export default function Home({ navigation }) {
  const [loading, setloading] = useState(false);
  const [images, setImages] = useState([]);
  const [creds, setcreds] = useState({ phone: "oidssds", otp: "dfsdf" });
  const [formaterror, setformaterror] = useState(null);
  const [logginSuccess, setLogginSuccess] = useState(false);

  const { user, setuser } = useContext(UserContext);

  useEffect(() => {
    if (phoneNumberPattern.test(creds.phone)) {
      setformaterror(null);
    } else {
      setformaterror("Invalid phone number format");
    }

    const fetchImages = async () => {
      const randomImages = await FUNCS.GetRandomImages(
        5,
        IMG_SIZE.w,
        IMG_SIZE.h
      );

      setImages(randomImages.map((img, i) => img.urls.regular));
      checkUserLogin();
    };

    fetchImages();
  }, []);

  const saveSession = async (userData) => {
    setuser(userData);
    await AsyncStorage.setItem("@KOOP:user", JSON.stringify(userData));
  };

  const onRequestOtp = async () => {
    if (formaterror !== null) {
      alert("Invalid phone number", "The phone number enterred is invalid!");
      return;
    }
    setloading(true);

    const { phone, otp: pin } = creds;
    const userData = await API.login(phone, pin);

    if (userData.error) {
      const { error } = userData;

      if (error === "USER_NOT_FOUND") {
        setloading(false);
        Alert.alert(
          "User not found!",
          `User with phone number ${creds.phone} not found, do you wanna create a new account?`,
          [
            {
              text: "CREATE MY ACCOUNT",
              onPress: () => {
                navigation.replace("ProfileAndShopSetup", {
                  phone: creds.phone,
                });
              },
            },
            {
              text: "EXPLORE AS GUEST",
              destructive: true,
              onPress: () => {
                navigation.push("Explore");
              },
            },
          ],
          { cancelable: false }
        );
      } else if (error === "WRONG_PIN") {
        setloading(false);
        Alert.alert("Wrong PIN", "You have eneterred a wrong PIN!");
      } else {
        setloading(false);
        alert("Error login, try again later");
      }
    } else {
      //user logged in
      setloading(false);
      setLogginSuccess(true);
      await saveSession(userData);
      navigation.replace("Home");
    }
  };

  const checkUserLogin = async () => {
    const user = await AsyncStorage.getItem("@KOOP:user");
    if (user) {
      console.log("found user => ", user);
      setLogginSuccess(true);
      setuser(JSON.parse(user));
      navigation.navigate("Home", user);
    }
  };

  useEffect(() => {
    if (phoneNumberPattern.test(creds.phone)) {
      setformaterror(null);
    } else {
      setformaterror("Invalid phone number format");
    }
  }, [creds]);

  function onLoginValueChange(type, val) {
    // Pattern for a 10-digit phone number

    setcreds((old) => ({ ...old, [type]: val }));
  }

  return (
    <ScrollView style={[{ backgroundColor: KOOP_BLUE }]}>
      <View style={[styles.container]}>
        <View>
          <Image
            transition={1500}
            contentFit="cover"
            source={require("../assets/koop.png")}
            style={[styles.alignSelfCenter, styles.logo]}
            placeholder={blurhash}
          />
          <Text style={[styles.tc, styles.pt, { marginBottom: 10 }]}>
            + 1 millions de services et des professionels au bout de vos doigts
          </Text>

          <SliderBox autoplay circleLoop images={images} />
        </View>

        {!loading && (
          <View style={[styles.formCont]}>
            <View>
              <Text style={[styles.tc, styles.bigText]}>Welcome to KOOP</Text>
              <Text style={[styles.tc]}>
                Pleas use your phone number to login
              </Text>
            </View>

            <View>
              <TextInput
                keyboardType="phone-pad"
                style={[styles.txtInput, styles.mt]}
                placeholder="Phone ex: 0980967780"
                value={creds.phone || ""}
                onChangeText={(text) => onLoginValueChange("phone", text)}
              />
              <Text
                style={[
                  formaterror === null ? { color: "white" } : styles.error,
                ]}
              >
                Invalid phone number
              </Text>

              <TextInput
                keyboardType="number-pad"
                secureTextEntry
                style={[styles.txtInput, styles.mt]}
                placeholder="OTP"
                value={creds.otp || ""}
                onChangeText={(text) => onLoginValueChange("otp", text)}
              />
              <TouchableOpacity
                disabled={loading}
                onPress={(e) => onRequestOtp()}
              >
                {!loading && (
                  <Text
                    style={[
                      styles.btn,
                      styles.bigText,
                      loading ? { backgroundColor: "grey" } : "",
                    ]}
                  >
                    REQUEST OTP
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading && (
          <View
            style={[
              {
                flex: 1,
                flexGrow: 1,
                height: 120,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <ActivityIndicator color={WHITE} animating={loading} />
          </View>
        )}

        {logginSuccess && (
          <View style={[styles.logginsuccess]}>
            <Image
              source={require("../assets/icons/check.png")}
              style={[{ width: 40, height: 40 }]}
            />
            <Text>Loggin success</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logginsuccess: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    margin: 18,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  logo: {
    height: 100,
    marginTop: 20,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: KOOP_BLUE,
  },
  tc: {
    textAlign: "center",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },

  scrollView: {
    paddingHorizontal: 12,
  },
  imgDiapo: {
    marginRight: 10,
  },
  pt: {
    paddingTop: 12,
  },
  mt: {
    marginTop: 24,
  },
  formCont: {
    backgroundColor: "white",
    flex: 1,
    borderTopStartRadius: 48,
    borderTopEndRadius: 48,
    marginTop: 36,
    padding: 36,
  },
  formTypeTitleCont: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formTitle: {
    fontSize: 18,
  },
  sel: {
    borderBottomColor: KOOP_BLUE,
    borderBottomWidth: 4,
    color: KOOP_BLUE,
  },
  bigText: {
    fontSize: BIG_FONT_SIZE,
  },
  txtInput: {
    padding: 8,
    margin: 8,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 12,
  },
  btn: {
    alignSelf: "center",
    backgroundColor: KOOP_BLUE,
    width: "100%",
    textAlign: "center",
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    color: "white",
    overflow: "hidden",
  },
});
