import { View, Text } from "react-native";
import MenuButton from "../components/MenuButton";
import styles from "../helpers/styles";

const OTHER_SERVICES = [
  {
    label: "SEVICES DANS LES PARAGES",
    icon: require("../assets/icons/map.png"),
    desc: "Localiser tous les services dans les parages",
    active: true,
    route: "NearServices",
  },
  {
    label: "TAJI",
    icon: require("../assets/icons/taji.png"),
    desc: "Ganger de l'argent en partagent des liens",
    active: true,
    route: "TAJI",
  },
  {
    label: "LOCALISATION GPS",
    icon: require("../assets/icons/gps.png"), //cool
    desc: "Localisation de vos biens (vehicule, moto etc.)",
    active: true,
    route: "GPS",
  },
  {
    label: "ACHAT CREDIT",
    icon: require("../assets/icons/phone.png"),
    active: true,
    route: "TalkTime",
  },
  {
    label: "ENVOI ARGENT TOUS RESEAUX",
    icon: require("../assets/icons/transaction.png"),
    active: true,
    route: "EMoney",
  },
];

export default function Other({ navigation }) {
  const handleOnPress = (e) => {
    console.log(e.route);

    if (e.route === "GPS") {
      navigation.navigate(e.route);
    }
  };

  return (
    <View style={[styles.bgBlue, styles.flex1]}>
      <View
        style={[
          styles.bgWhite,
          styles.flex1,
          styles.mtLarge,
          styles.borderTopRadiusLarge,
          styles.paddingLarge,
        ]}
      >
        {OTHER_SERVICES.map(
          (os, i) =>
            os.active && (
              <View key={i}>
                <MenuButton
                  handleOnPress={handleOnPress}
                  btn={{ id: i, ...os }}
                  textSmall
                />
                {os.desc && (
                  <Text style={[styles.textCenter, styles.marginVMin]}>
                    {os.desc}
                  </Text>
                )}
              </View>
            )
        )}
      </View>
    </View>
  );
}
