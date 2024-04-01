import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../helpers/styles";
import { Image } from "expo-image";
import SimpSimpleTextButtonle from "../components/SimpleTextButton";
import * as SB from "../utils/db";
import { TABLE_NAMES } from "../utils/supabase";
import ImageAdder from "../components/ImageAdder";

function ServiceRequest({ navigation, route }) {
  const [servData, setServData] = useState({ images: [] });
  const [images, stimages] = useState([]);

  const [hasMoreData, setHasMoreData] = useState(false);
  const toggleHasMoreData = () =>
    setHasMoreData((previousState) => !previousState);

  const onPost = () => {
    alert(JSON.stringify(servData));
  };

  useEffect(() => {
    alert(JSON.stringify(servData));
  }, [servData]);

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
          style={[st.ti]}
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
            },
          ]}
        >
          <Text>Add more Info</Text>
          <Switch
            style={[
              {
                justifyContent: "flex-start",
                alignSelf: "flex-start",
              },
            ]}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={hasMoreData ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleHasMoreData}
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
              style={[styles.ti]}
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

        <SimpSimpleTextButtonle text={"POST"} handlePress={onPost} />
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
