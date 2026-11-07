import { ScrollView } from "react-native";
import MenuButton from "../components/MenuButton";
import { FadeIn, Text } from "../components/ui";
import { colors, space, type } from "../theme";

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
    if (e.route === "GPS") {
      navigation.navigate(e.route, undefined, { pop: true });
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}
    >
      <Text style={type.h1}>Plus de services</Text>
      <Text style={[type.body, { color: colors.textMuted, marginTop: 4, marginBottom: space.sm }]}>
        Tout ce dont vous avez besoin au quotidien, au même endroit.
      </Text>
      {OTHER_SERVICES.filter((os) => os.active).map((os, i) => (
        <FadeIn key={os.route} delay={i * 60}>
          <MenuButton
            handleOnPress={handleOnPress}
            btn={{ id: i, ...os }}
            subtitle={os.desc || (os.route !== "GPS" ? "Bientôt disponible" : undefined)}
          />
        </FadeIn>
      ))}
    </ScrollView>
  );
}
