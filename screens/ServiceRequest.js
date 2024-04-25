import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import styles from "../helpers/styles";
import { Image } from "expo-image";
import SimpSimpleTextButtonle from "../components/SimpleTextButton";
import * as SB from "../utils/db";
import * as API from "../utils/api";
import { TABLE_NAMES } from "../utils/supabase";
import ImageAdder from "../components/ImageAdder";
//import * as API from "../utils/api";
import UserContext from "../context/UserContext";
import LoadingButton from "../components/LoadingButton";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import INeed from "../components/INeed";
import LinksBox from "../components/LinksBox";
import SimpleTextButton from "../components/SimpleTextButton";

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
                      navigation.navigate("PremiumSubscriptions");
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
                Alert.alert(
                  "Annonce postee!",
                  "Votre annonce a ete postee avec success.",
                  [
                    {
                      text: "Super 😎!",

                      onPress: () => navigation.navigate("Look"),
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
    navigation.navigate("Subscriptions");
  };

  return (
    <ScrollView>
      <View style={[styles.paddingSmall]}>
        <View
          style={[
            {
              height: 120,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Image
            source={require("../assets/icons/service.png")}
            transition={1000}
            style={[{ width: 100, height: 100 }]}
          />
        </View>
        <Text style={[{ textAlign: "center" }]}>
          Lancer une nouvelle annonce, un article ou une demande de service
        </Text>
        <INeed />
        <Text style={[{ marginVertical:12 }]} >Description de votre annonce </Text>
        <TextInput
          multiline={true}
          style={[
            st.ti,
            { marginVertical: 12, fontSize: 18, textAlignVertical: "center", borderColor: emptyLabel ? 'red' : 'gray' },
            styles.paddingSmall,
          ]}
          placeholder="ex:Besoin d'un MacBook pro ..."
          value={servData.label || ""}
          onChangeText={(txt) =>
            setServData((prev) => ({ ...prev, label: txt }))
          }
        />

        <View
          style={[
            {
              gap: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 12,
            },
          ]}
        >
          <Text>Add more Info</Text>
          <Switch
            style={[
              {
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                marginVertical: 12,
              },
            ]}
            trackColor={{ false: "#767577", true: KOOP_BLUE }}
            thumbColor={hasMoreData ? KOOP_BLUE_DARK : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(e) => {
              setServData((prev) => ({ ...prev, images: [] }));
              toggleHasMoreData();
            }}
            value={hasMoreData}
          />
        </View>

        {hasMoreData && (
          <View>
            <View>
              <Text>Add Links</Text>
              <LinksBox onLinksAdd={onLinksAdd} />
            </View>

            <View>
              <Text>Add Pictures</Text>
              <ImageAdder
                navigation={navigation}
                onImageAdded={onImageAdded}
                onImagePressed={onImagePressed}
              />
            </View>
          </View>
        )}

        <View>
          <View style={{ flexDirection: "row" }}>
            {ANNOUNCE_TYPE.map((pt, i) => (
              <TouchableOpacity onPress={(e) => setAnnounceType(pt)}>
                <View
                  style={[
                    {
                      padding: 12,
                      backgroundColor:
                        i === announceType.id ? "purple" : "#ffffff00",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: i === announceType.id ? "bold" : "normal",
                      color: i === announceType.id ? "white" : "black",
                    }}
                  >
                    {pt.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              borderWidth: 2,
              borderColor: "purple",
              padding: 8,
              borderBottomStartRadius: 18,
              borderBottomEndRadius: 18,
            }}
          >
            <View>
              <Text style={[st.subt]}>{announceType.desc}</Text>
              <LoadingButton
                text={"POST"}
                handlePress={onPost}
                loading={loading}
              />
            </View>
          </View>
        </View>

        {/* <View style={[styles.paddingLarge]}>
          <LoadingButton text={"POST"} handlePress={onPost} loading={loading} />
          <Text style={[st.subt]}>
            Une annonce normale ne s'affiche que pour 24h
          </Text>
          <SimpleTextButton text={"POST as AD"} handlePress={onPostAsAd} />
          <Text style={[st.subt]}>
            Une annonce promo s'affichera au top des recherches pour plus de
            visibilite, selon la duree que vous allez choisir selon votre budget
            😎
          </Text>
        </View> */}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  ti: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 16,
    borderColor: "#ddd",
  },
  subt: {
    color: "grey",
    fontStyle: "italic",
  },
  posttbtn: {
    padding: 12,
  },
});

ServiceRequest.ROUTE = "ServiceRequest";

export default ServiceRequest;
