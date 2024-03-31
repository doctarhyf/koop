import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
import React, { useState } from "react";
import styles from "../helpers/styles";
import { Image } from "expo-image";
import SimpSimpleTextButtonle from "../components/SimpleTextButton";
import * as SB from "../utils/db";
import { TABLE_NAMES } from "../utils/supabase";

function ServiceRequest() {
  const [label, setlabel] = useState("");

  const [hasMoreData, setHasMoreData] = useState(false);
  const toggleHasMoreData = () =>
    setHasMoreData((previousState) => !previousState);

  const onPost = () => {
    //alert("on post");
    const servReqData = { label: label };
    alert(JSON.stringify(servReqData));
    //SB.insertItem(TABLE_NAMES.KOOP_SERVICES_REQUEST, servReqData)
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
        value={label}
        onChangeText={setlabel}
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
          <Text>Pictures</Text>
        </View>
      )}

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
