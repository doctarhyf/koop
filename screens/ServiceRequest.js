import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import ImageAdder from "../components/ImageAdder";
import INeed from "../components/INeed";
import LinksBox from "../components/LinksBox";
import { Button, Card, FadeIn, Input, PressableScale, Text, haptic } from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, radius, space, type } from "../theme";
import * as API from "../utils/api";

const ANNOUNCE_TYPE = [
  {
    id: 0,
    type: "STANDARD",
    label: "Standard",
    desc: ` · Une annonce normale ne s'affiche que pour 24h`,
  },
  {
    id: 1,
    type: "PREMIUM",
    label: "Premium",
    desc: `· S'affichera au top des recherches pour plus de visibilite💯
· Duree d'affichage selon votre budget 😎
· Garantie d'atteindre le maximum d'audiance✅🙏`,
  },
];
function ServiceRequest({ navigation, route }) {
  const [announceType, setAnnounceType] = useState(ANNOUNCE_TYPE[0]);
  const [servData, setServData] = useState({
    images: [],
    label: "",
    desc: "",
    links: "",
  });
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);
const [emptyLabel, setEmptyLabel] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const toggleHasMoreData = () =>
    setHasMoreData((previousState) => !previousState);
    
    useEffect(()=> {
    
    const error = servData && servData.label === '';
    	setEmptyLabel(error)
    
    
    }, [servData])

  const onPost = async () => {
    // alert(servData.label);

    if (servData.label.trim() === "") {
      Alert.alert(
        "Decription",
        "Veuillez entrer une description de votre annonce ..."
      );
      
      
      return;
    }
    Alert.alert(
      "Post item?",
      "Are you sure there's no any mistakes? proceed with posting?",
      [
        {
          text: "Let me recheck",
        },
        {
          text: "Procee with posting",
          style: "destructive",
          onPress: async () => {
            if (announceType.id === 1) {
              Alert.alert(
                "Annonce Premium",
                "Vous devez disposer d'un abonnement premium pour lancer une annonce premium",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("PremiumSubscriptions", undefined, { pop: true });
                    },
                  },
                ]
              );
              return;
            }

            setloading(true);
            const { label, images, desc } = servData;

            if (
              (label && label.trim().length === 0) ||
              label.length.label < 10
            ) {
              Alert.alert(
                `Label : "${label}" too short`,
                "Label text must be over 10 caracters"
              );
              setloading(false);
              return;
            }

            if (
              hasMoreData &&
              ((desc && desc.trim().length === 0) || label.length.label < 10)
            ) {
              Alert.alert(
                `Dascription text too short`,
                "Description text must be over 10 caracters"
              );
              setloading(false);
              return;
            }

            const finalData = { ...servData };
            finalData.user_id = user.id;

            try {
              setloading(true);

              const res = await API.insertServiceRequest(user, finalData);
              //alert(JSON.stringify(res));
              const posted = res.id;
              if (posted) {
                haptic("success");
                Alert.alert(
                  "Annonce postee!",
                  "Votre annonce a ete postee avec success.",
                  [
                    {
                      text: "Super 😎!",

                      onPress: () => navigation.navigate("Look", undefined, { pop: true }),
                    },
                  ]
                );
              }else{
              alert(JSON.stringify(res))
              }
              setloading(false);
            } catch (e) {
              setloading(false);
              alert("Error : " + JSON.stringify(e));
            }
          },
        },
      ]
    );
  };

  const onImageAdded = (newimages) => {
    setServData((prev) => ({ ...prev, images: newimages }));
  };

  const onImagePressed = (dt) => {
    alert(dt);
  };

  const onLinksAdd = (links) => {
    setServData((prev) => ({ ...prev, links: links }));
  };

  const onPostAsAd = () => {
    navigation.navigate("Subscriptions", undefined, { pop: true });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: space.xxxl }}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn>
          <INeed />
        </FadeIn>

        <FadeIn delay={60}>
          <Input
            label="Que recherchez-vous ou proposez-vous ?"
            multiline
            icon="edit-3"
            placeholder="ex : Besoin d'un MacBook Pro M3, bon état…"
            value={servData.label || ""}
            hint={`${(servData.label || "").length} caractères · minimum 10`}
            onChangeText={(txt) => setServData((prev) => ({ ...prev, label: txt }))}
          />
        </FadeIn>

        <FadeIn delay={120}>
          <Card style={{ gap: space.md }}>
            <View style={st.toggleRow}>
              <View style={st.toggleIcon}>
                <Feather name="image" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.bodyStrong}>Photos et liens</Text>
                <Text style={[type.small, { color: colors.textMuted }]}>
                  Les annonces avec photos reçoivent bien plus de réponses
                </Text>
              </View>
              <Switch
                trackColor={{ false: colors.line, true: colors.primary }}
                thumbColor="#fff"
                ios_backgroundColor={colors.line}
                onValueChange={() => {
                  setServData((prev) => ({ ...prev, images: [] }));
                  toggleHasMoreData();
                }}
                value={hasMoreData}
              />
            </View>

            {hasMoreData && (
              <View style={{ gap: space.md }}>
                <View style={{ gap: 6 }}>
                  <Text style={type.overline}>Liens</Text>
                  <LinksBox onLinksAdd={onLinksAdd} />
                </View>
                <View style={{ gap: 6 }}>
                  <Text style={type.overline}>Photos</Text>
                  <ImageAdder
                    navigation={navigation}
                    onImageAdded={onImageAdded}
                    onImagePressed={onImagePressed}
                  />
                </View>
              </View>
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={180} style={{ gap: space.sm }}>
          <Text style={[type.overline, { color: colors.textMuted, marginLeft: 4 }]}>Type d'annonce</Text>
          <View style={{ flexDirection: "row", gap: space.sm }}>
            {ANNOUNCE_TYPE.map((pt) => {
              const on = pt.id === announceType.id;
              const premium = pt.type === "PREMIUM";
              const tint = premium ? colors.violet : colors.primary;
              return (
                <PressableScale
                  key={pt.id}
                  onPress={() => setAnnounceType(pt)}
                  hapticKind="select"
                  style={[st.plan, on && (premium ? st.planOnPremium : st.planOn)]}
                >
                  <View style={st.planHead}>
                    <Feather name={premium ? "star" : "zap"} size={18} color={on ? tint : colors.textMuted} />
                    <View style={[st.radio, on && { borderColor: tint }]}>
                      {on && <View style={[st.radioDot, { backgroundColor: tint }]} />}
                    </View>
                  </View>
                  <Text style={type.title}>{pt.label}</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>
                    {premium ? "En tête des résultats" : "Visible 24 h"}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
          <Text style={[type.small, { color: colors.textMuted, paddingHorizontal: 4 }]}>
            {announceType.desc}
          </Text>
        </FadeIn>

        <Button
          title={announceType.type === "PREMIUM" ? "Publier en Premium" : "Publier l'annonce"}
          icon="send"
          loading={loading}
          onPress={onPost}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  toggleRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  plan: {
    flex: 1,
    gap: 4,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  planOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  planOnPremium: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  planHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});

ServiceRequest.ROUTE = "ServiceRequest";

export default ServiceRequest;
