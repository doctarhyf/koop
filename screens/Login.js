import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import ImageSlider from "@coder-shubh/react-native-image-slider";
import { KOOP_BLUE, KOOP_BLUE_DARK, WHITE } from "../helpers/colors";
import { BIG_FONT_SIZE, IMG_SIZE } from "../helpers/flow";
import { blurhash } from "../utils/const";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FUNCS from "../helpers/funcs";
import * as API from "../utils/api";

import UserContext from "../context/UserContext";
import ProfileSetup from "./ProfileSetup";

const phoneNumberPattern = /^\d{10}$/;
export default function Home({ navigation }) {
  const [loading, setloading] = useState(false);
  const [images, setImages] = useState([]);
  const [creds, setcreds] = useState({ phone: "", otp: "" });
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
      await AsyncStorage.removeItem("tmp");
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
    const { otp } = creds;

    if (otp === undefined || otp === null || otp.trim() === "") {
      Vibration.vibrate(250);
      alert("PIN cant be empty");
      return;
    }

    if (formaterror !== null) {
      Vibration.vibrate(250);
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
                navigation.replace(ProfileSetup.ROUTE, {
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
      setloading(false);
      setLogginSuccess(true);
      await saveSession(userData);
      navigation.replace("Home");
    }
  };

  const checkUserLogin = async () => {
    setloading(true);
    const user = await AsyncStorage.getItem("@KOOP:user");
    setloading(false);
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

          {/* <SliderBox autoplay circleLoop images={images} /> */}

          <ImageSlider
            images={images}
            imageHeight={250}
            dotSize={10}
            dotColor="white"
            activeDotColor={KOOP_BLUE_DARK}
            showNavigationButtons={false}
            showIndicatorDots={true}
            imageLabel={false}
            label=""
            extrapolate="clamp"
            autoSlideInterval={5000}
            containerStyle={{ marginBottom: 20 }}
            radius={5}
          />
        </View>

        {!loading && (
          <View style={[styles.formCont]}>
            <View>
              <Text style={[styles.tc, styles.bigText, { marginVertical: 8 }]}>
                Welcome to KOOP
              </Text>
              <Text style={[styles.tc, , { marginVertical: 8 }]}>
                Please enter your phone number below. The default PIN is 0000
              </Text>
            </View>

            <View>
              <TextInput
                maxLength={10}
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
                placeholder="PIN" //"OTP"
                value={creds.otp || ""}
                maxLength={6}
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
                    LOGIN
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
    padding: 12,
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
