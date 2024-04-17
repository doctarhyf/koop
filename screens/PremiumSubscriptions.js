import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_TRANSLUCIDE,
} from "../helpers/colors";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import CustomAlert from "../components/CustomAlert";
import { useFetch2 } from "../hooks/useFetch";
import * as LocalAuthentication from "expo-local-authentication";

const PAYMENT_METHODS = [
  { icon: require("../assets/icons/visa.png"), label: "VISA" },
  { icon: require("../assets/icons/orange.png"), label: "VISA" },
  { icon: require("../assets/icons/airtel.png"), label: "VISA" },
  { icon: require("../assets/icons/mpesa.png"), label: "VISA" },
];

export default function PremiumSubscriptions({ navigation, route }) {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [selectedSub, setselectedSub] = React.useState(0);
  const [selectedPayment, setselectedPayment] = React.useState(0);
  const [show, setshow] = useState(false);
  const [loading, bundles, error, reload] = useFetch2(
    "https://konext.vercel.app/api/sreq/subbund?type=sreq"
  );

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricAvailable(compatible);

    // alert(`Biometric compatible ${compatible}`);
  };

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID",
      // disableDeviceFallback: true, // Only allow Face ID, not fallback to passcode
      fallbackLabel: "Enter Passcode cool", // Custom fallback label
    });
    if (result.success) {
      // alert("Authentication successful!");
      if (show === false) {
        setTimeout(() => {
          navigation.navigate("PaymentResult");
          setshow(false);
        }, 2500);
      }

      setshow((prev) => !prev);
    } else {
      alert("Authentication failed!");
    }
  };

  const handleOnPress = (e) => {
    authenticate();
  };

  return loading ? (
    <ActivityIndicator
      animating={true}
      color={KOOP_BLUE}
      style={[styles.paddingLarge]}
    />
  ) : (
    <ScrollView>
      <View style={[styles.paddingSmall]}>
        <Text style={[{ fontSize: 18, fontWeight: "bold" }]}>
          Duree de votre Annonce
        </Text>

        <Text>Choisir la duree qui vous convient</Text>

        <Text style={[styles.marginVMin, styles.marginTopLarge]}>
          SUBSCRIPTION
        </Text>

        <View style={[styles.marginBottomLarge]}>
          {bundles &&
            bundles.map((bundle, i) => (
              <TouchableOpacity key={i} onPress={(e) => setselectedSub(i)}>
                <View
                  style={[
                    i === selectedSub
                      ? { backgroundColor: KOOP_BLUE_TRANSLUCIDE }
                      : { backgroundColor: "#eee" },
                    styles.marginTopSmall,
                    styles.paddingSmall,
                    { borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
                    i === selectedSub ? styles.borderBlue : null,
                    i === selectedSub ? st.activeSub : null,
                  ]}
                >
                  <View style={[styles.justifyBetween, styles.flexRow]}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {bundle.label}
                    </Text>
                    <View
                      style={[
                        st.cbsubcont,
                        styles.justifyCenter,
                        styles.alignCenter,
                      ]}
                    >
                      <View
                        style={[
                          st.cbsub,
                          i === selectedSub ? st.bgOn : st.bgOff,
                        ]}
                      ></View>
                    </View>
                  </View>
                  <View style={[styles.flexRow]}>
                    <Text>{bundle.prices.split(",")[0]} CDF</Text>
                    {bundle.prices.split(",")[1] && (
                      <Text style={[st.oldprice, styles.marginH]}>
                        {bundle.prices.split(",")[1]} CDF
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    {bundle.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        <Text style={[styles.marginVMin]}>PAYMENT METHODS</Text>
        <Text>
          For your security, all orders are processed via mobile money.
        </Text>
        <View style={[st.pay]}>
          {PAYMENT_METHODS.map((pay, i) => (
            <TouchableOpacity key={i} onPress={(e) => setselectedPayment(i)}>
              <Image
                source={pay.icon}
                style={[
                  styles.marginH,
                  i === selectedPayment
                    ? { borderWidth: 2, borderColor: KOOP_BLUE }
                    : null,
                  ,
                  { width: 40, height: 40 },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text>You can cancel your subscription anytime.</Text>

        <MenuButton
          btn={{
            id: 0,
            label: "LANCER ANNONCE",
            icon: require("../assets/icons/subscription.png"),
          }}
          handleOnPress={handleOnPress}
        />
      </View>
      <CustomAlert
        visible={show}
        onClose={(e) => setshow(false)}
        message={"this is sample message"}
      >
        <ActivityIndicator animating={true} color={KOOP_BLUE} />
      </CustomAlert>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  pay: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 8,
  },
  header: {
    backgroundColor: KOOP_BLUE,
    color: "white",
  },
  oldprice: {
    color: "red",
    fontStyle: "italic",
    textDecorationLine: "line-through",
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
  bgOn: { backgroundColor: KOOP_BLUE_DARK },
  bgOff: { backgroundColor: "#9996" },
  activeSub: {
    borderWidth: 2,
    borderColor: KOOP_BLUE_DARK,
  },
});
