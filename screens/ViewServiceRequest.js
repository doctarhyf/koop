import { View, Text, Switch, TouchableOpacity, Linking } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import SimpleTextButton from "../components/SimpleTextButton";
import styles from "../helpers/styles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import { ParseCreatedAt } from "../helpers/funcs";
import { Image } from "expo-image";

const ACTION = {
  SEND_MESSAGE: "send_message",
  INTERESTED: "interested",
  CALL_NOW: "call_now",
};

export default function ViewServiceRequest({ navigation, route }) {
  const serviceRequest = route.params;
  const postedBy = serviceRequest.user_data;
  const [showMore, setShowMore] = useState(false);
  const date = ParseCreatedAt(postedBy.created_at).full;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Info de la demande",
    });
  }, [navigation]);

  const makePhoneCall = (phone) => {
    const phoneNumber = phone; // The phone number you want to call
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const onAction = (it) => {
    const { action } = it;
    switch (action) {
      case ACTION.SEND_MESSAGE:
        navigation.navigate("SendMessage", postedBy);
        break;

      case ACTION.INTERESTED:
        alert("Interested");
        break;

      case ACTION.CALL_NOW:
        makePhoneCall(postedBy.phone);
        break;

      default:
        break;
    }
  };

  const toggleSwitch = () => setShowMore((previousState) => !previousState);

  return (
    <View style={[styles.paddingMid]}>
      <View
        style={[
          { gap: 12 },
          styles.flexRow,
          styles.justifyCenter,
          styles.alignCenter,
        ]}
      >
        <Image
          source={postedBy.profile}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            overflow: "hidden",
          }}
        />

        <View>
          <Text>
            {postedBy.ville} - {postedBy.display_name}
          </Text>
          <Text style={[styles.textGray]}>{date}</Text>
        </View>
      </View>

      <Text
        style={[
          {
            backgroundColor: "#eeeeee",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 8,
          },
          styles.paddingSmall,
        ]}
      >
        {serviceRequest.label}
      </Text>

      <View
        style={[
          styles.paddingMid,
          styles.flexRow,
          { gap: 8 },
          styles.justifyCenter,
          styles.alignCenter,
        ]}
      >
        <Text>View more details</Text>
        <Switch
          trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
          thumbColor={showMore ? KOOP_BLUE : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={showMore}
        />
      </View>

      {showMore && (
        <View>
          <Text>Description </Text>
          <Text>Photos</Text>
        </View>
      )}

      <View
        style={[
          styles.flexRow,
          {
            gap: 18,
            borderTopColor: "#cccccc",
            borderTopWidth: 1,
            backgroundColor: "#eeeeee99",
            marginTop: 12,
          },
          styles.justifyCenter,
          styles.alignCenter,
          styles.paddingSmall,
        ]}
      >
        {[
          {
            label: "Interrested",
            action: ACTION.INTERESTED,
            icon: <Ionicons name="pricetags" size={24} color={KOOP_BLUE} />,
          },
          {
            label: "Send text",
            action: ACTION.SEND_MESSAGE,
            icon: (
              <MaterialCommunityIcons
                name="message-text-outline"
                size={24}
                color={KOOP_BLUE}
              />
            ),
          },
          {
            label: "Call now",
            action: ACTION.CALL_NOW,
            icon: <Feather name="phone-call" size={24} color={KOOP_BLUE} />,
          },
        ].map((it, i) => (
          <TouchableOpacity onPress={(e) => onAction(it)}>
            <View style={[styles.justifyCenter, styles.alignCenter]}>
              <Text>{it.label}</Text>
              {it.icon}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
