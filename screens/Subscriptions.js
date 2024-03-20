import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_TRANSLUCIDE,
} from "../helpers/colors";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";

const SUBS = [
  {
    type: "Free",
    price: "",
    desc: "Pour une experiance de base, sans aucun perks",
  },
  {
    type: "Monthly",
    price: "$4,99 / month",
    desc: "Pour un abonnement mensuel",
  },
  {
    type: "Yearly",
    price: "$50 / year",
    oldprice: "$59.88 / year",
    desc: "Pour un abonnement annuel",
  },
];

const PAYMENT_METHODS = [
  { icon: require("../assets/icons/visa.png"), label: "VISA" },
  { icon: require("../assets/icons/orange.png"), label: "VISA" },
  { icon: require("../assets/icons/airtel.png"), label: "VISA" },
  { icon: require("../assets/icons/mpesa.png"), label: "VISA" },
];

export default function Subscriptions() {
  const [selectedSub, setselectedSub] = React.useState(0);
  const [selectedPayment, setselectedPayment] = React.useState(0);

  return (
    <ScrollView>
      <View style={[styles.paddingSmall]}>
        <Text style={[styles.marginVMin, styles.marginTopLarge]}>
          MY CURRENT SUBSCRIPTION
        </Text>

        <Text>Ends : Nov 2024</Text>

        <Text style={[styles.marginVMin, styles.marginTopLarge]}>
          SUBSCRIPTION
        </Text>

        <View style={[styles.marginBottomLarge]}>
          {SUBS.map((sub, i) => (
            <TouchableOpacity key={i} onPress={(e) => setselectedSub(i)}>
              <View
                style={[
                  i === selectedSub
                    ? { backgroundColor: KOOP_BLUE_TRANSLUCIDE }
                    : { backgroundColor: "#eee" },
                  styles.marginTopSmall,
                  styles.paddingSmall,
                  i === selectedSub ? styles.borderBlue : null,
                  i === selectedSub ? st.activeSub : null,
                ]}
              >
                <View style={[styles.justifyBetween, styles.flexRow]}>
                  <Text>{sub.type}</Text>
                  <View
                    style={[
                      st.cbsubcont,
                      styles.justifyCenter,
                      styles.alignCenter,
                    ]}
                  >
                    <View
                      style={[st.cbsub, i === selectedSub ? st.bgOn : st.bgOff]}
                    ></View>
                  </View>
                </View>
                <View style={[styles.flexRow]}>
                  <Text>{sub.price}</Text>
                  {sub.oldprice && (
                    <Text style={[st.oldprice, styles.marginH]}>
                      {sub.oldprice}
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: "#666" }}>{sub.desc}</Text>
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
            label: "CHANGE SUBSCRIPTION",
            icon: require("../assets/icons/subscription.png"),
          }}
          handleOnPress={(e) => console.log(e)}
        />
      </View>
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
  bgOn: { backgroundColor: "green" },
  bgOff: { backgroundColor: "#9996" },
  activeSub: {
    borderWidth: 2,
    borderColor: KOOP_BLUE_DARK,
  },
});
