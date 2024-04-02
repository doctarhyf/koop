import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
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
function ServiceRequest({ navigation, route }) {
  const [servData, setServData] = useState({ images: [] });
  const { user, setuser } = useContext(UserContext);
  const [loading, setloading] = useState(false);

  const [hasMoreData, setHasMoreData] = useState(false);
  const toggleHasMoreData = () =>
    setHasMoreData((previousState) => !previousState);

  const onPost = async () => {
    //alert(JSON.stringify(servData));
    setloading(true);
    const { label, images, desc } = servData;

    if ((label && label.trim().length === 0) || label.length.label < 10) {
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
      const res = await API.insertServiceRequest(finalData);

      setloading(false);

      //alert(JSON.stringify(res));
      if (res && res.length === 1) {
        Alert.alert(
          "Request posted!",
          "Votre demande a ete postee avec success.Aller a la page My Products & services?",
          [
            { text: "Rester ICI" },
            {
              text: "My Prods & Serv,",
              style: "destructive",
              onPress: () => navigation.replace("MyServices", res[0]),
            },
          ]
        );
      }
    } catch (e) {
      setloading(false);
      alert("Error : " + JSON.stringify(e));
    }
  };

  const onImageAdded = (img) => {
    const new_images = [...servData.images];

    const images_exists = new_images.includes(img);

    if (!images_exists) {
      new_images.push(img);
    }

    setServData((prev) => ({ ...prev, images: new_images }));
  };

  const onImagePressed = (dt) => {
    alert(dt);
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
          De quel type de service avez vous besoin ?
        </Text>
        <Text
          style={[
            {
              fontSize: 32,
              textAlign: "center",
              marginVertical: 18,
              fontWeight: "bold",
            },
          ]}
        >
          J'ai besoin de ...
        </Text>
        <TextInput
          multiline={true}
          style={[st.ti, { marginVertical: 12 }]}
          placeholder="ex: 1 menuisier pour finir une charpente ..."
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
            <Text>Descriptions</Text>
            <TextInput
              value={servData.desc || ""}
              onChangeText={(txt) =>
                setServData((prev) => ({ ...prev, desc: txt }))
              }
              multiline
              numberOfLines={5}
              placeholder="Ajouter beaucouplus de details sur ce que vous recherchez comme services ..."
              style={[styles.ti, { paddingVertical: 12 }]}
              textAlignVertical="top"
            />
            <Text>Pictures</Text>
            <ImageAdder
              navigation={navigation}
              onImageAdded={onImageAdded}
              onImagePressed={onImagePressed}
            />
          </View>
        )}

        <LoadingButton
          text={"POST"}
          handlePress={onPost}
          loading={loading}
          /* icon={
            <MaterialCommunityIcons
              name="send-circle-outline"
              size={24}
              color={KOOP_BLUE}
            />
          } */
        />
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
});

ServiceRequest.ROUTE = "ServiceRequest";

export default ServiceRequest;
