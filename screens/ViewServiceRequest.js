import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import SimpleTextButton from "../components/SimpleTextButton";

export default function ViewServiceRequest({ navigation, route }) {
  const serviceRequest = route.params;
  const postedBy = serviceRequest.user_data;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Info de la demande",
    });
  }, [navigation]);

  return (
    <View>
      <Text>
        {postedBy.display} - {postedBy.phone}
      </Text>
      <Text>{serviceRequest.label}</Text>
      <Text> {serviceRequest.desc} </Text>

      <View>
        <SimpleTextButton text={"Interresse"} />
        <SimpleTextButton text={"Add to watch list"} />
        <SimpleTextButton text={"Appeler Maintenant"} />
        <SimpleTextButton text={"Message"} />
      </View>
    </View>
  );
}
