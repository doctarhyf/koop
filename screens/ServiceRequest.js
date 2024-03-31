import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import styles from "../helpers/styles";
import { Image } from "expo-image";
import SimpSimpleTextButtonle from "../components/SimpleTextButton";

function ServiceRequest() {
  const onPost = () => {
    alert("on post");
  };
  return (
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
      />

      <SimpSimpleTextButtonle text={"POST"} handlePress={onPost} />
    </View>
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
