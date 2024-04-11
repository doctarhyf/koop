import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import SimpleTextButton from "../components/SimpleTextButton";
import styles from "../helpers/styles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { KOOP_BLUE, KOOP_BLUE_DARK } from "../helpers/colors";
import { ParseCreatedAt } from "../helpers/funcs";
import { Image } from "expo-image";
import UserContext from "../context/UserContext";
import { FontAwesome } from "@expo/vector-icons";
import * as API from "../utils/api";
import { TABLE_NAMES } from "../utils/supabase";
import LoadingButton from "../components/LoadingButton";
import { AntDesign } from "@expo/vector-icons";
import ImagesViewer from "../components/ImagesViewer";
import { Entypo } from "@expo/vector-icons";

const ACTION = {
  SEND_MESSAGE: "send_message",
  INTERESTED: "interested",
  CALL_NOW: "call_now",
  VIEW_SHOP: "view_shop",
};

const ACTION_BUTTONS = [
  {
    label: "Interrested",
    action: ACTION.INTERESTED,
    icon: <Ionicons name="pricetags" size={24} color={KOOP_BLUE} />,
  },
  {
    label: "Message",
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
  {
    label: "Voir le shop",
    action: ACTION.VIEW_SHOP,
    icon: <Feather name="home" size={24} color={KOOP_BLUE} />,
  },
];

export default function ViewServiceRequest({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const serviceRequest = route.params;
  const postedBy = serviceRequest.user_data;
  const [showMore, setShowMore] = useState(false);
  const date = ParseCreatedAt(postedBy.created_at).full;
  let me = serviceRequest.user_id === user.id;

  const [loading, setloading] = useState(false);
  const [comment, setcomment] = useState("");

  const sendComment = async (e) => {
    if (comment.trim() === "") {
      Alert.alert("Empty comment", "Write something to post please ...");
      return;
    }

    setloading(true);

    const commentBody = {
      item_id: serviceRequest.id,
      posted_by_id: user.id,
      comment: comment,
      item_type: "sreq",
    };

    const r = await API.postComment(commentBody);

    if (r[0] && r[0].id) {
      setcomment("");
      Alert.alert("Comment posted", "The comment has been posted", [
        {
          text: "OK",
          onPress: () =>
            navigation.replace("Comments", {
              item_id: commentBody.item_id,
              item_type: commentBody.item_type,
            }),
        },
      ]);
    } else {
      Alert.alert("Comment post error", JSON.stringify(r));
    }
    setloading(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Details",
      headerRight: () => (
        <TouchableOpacity
          onPress={(e) => navigation.navigate("ServiceRequest")}
        >
          <FontAwesome name="send" size={24} color={KOOP_BLUE} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const makePhoneCall = (phone) => {
    const phoneNumber = phone; // The phone number you want to call
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const onAction = (it) => {
    const shop_name = postedBy.shop_name;
    const shop_id = serviceRequest.user_id;
    const from_id = user.id;
    const to_id = postedBy.id;
    const name = serviceRequest.label;

    const { action } = it;
    switch (action) {
      case ACTION.SEND_MESSAGE:
        const data = {
          shop_name: shop_name,
          shop_id: shop_id,
          from_id: from_id,
          to_id: to_id,
          name: name,
        };
        navigation.navigate("SendMessage", data);
        break;

      case ACTION.INTERESTED:
        alert("Interested");
        break;

      case ACTION.CALL_NOW:
        makePhoneCall(postedBy.phone);
        break;

      case ACTION.VIEW_SHOP:
        navigation.navigate("Shop", postedBy);
        break;

      default:
        break;
    }
  };

  const toggleSwitch = () => setShowMore((previousState) => !previousState);

  const onDelete = async (item) => {
    Alert.alert("Delete item?", "There is no undo after deletion", [
      {
        text: "No",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setloading(true);
          const res = await API.deleteItem(
            TABLE_NAMES.KOOP_SERVICES_REQUEST,
            "id",
            item.id
          );

          setloading(false);

          if (res.error === null) {
            Alert.alert(
              "Announce deleted!",
              "Your announce has been deleted successfuly!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          } else {
            Alert.alert("Error deleting", JSON.stringify(error));
          }
        },
      },
    ]);
  };

  return (
    <ScrollView>
      <View style={[styles.paddingMid]}>
        {/*  <Text>{JSON.stringify(postedBy)}</Text> */}
        <View
          style={[
            { gap: 12 },
            styles.flexRow,
            styles.justifyCenter,
            styles.alignCenter,
          ]}
        >
          <TouchableOpacity
            onPress={(e) =>
              navigation.navigate("PhotoViewer", postedBy.profile)
            }
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
          </TouchableOpacity>

          <View>
            <Text>
              {postedBy.ville} - {me ? "Moi" : postedBy.display_name}
            </Text>
            <Text style={[styles.textGray]}>{serviceRequest.timeAgo}</Text>
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
            <Text>{serviceRequest.desc}</Text>
            <ImagesViewer
              images={serviceRequest.images}
              navigation={navigation}
            />
          </View>
        )}

        {!me && (
          <View
            style={[
              styles.flexRow,
              st.gray_bg,
              styles.justifyCenter,
              styles.alignCenter,
              styles.paddingSmall,
            ]}
          >
            {ACTION_BUTTONS.map((it, i) => (
              <TouchableOpacity key={i} onPress={(e) => onAction(it)}>
                <View style={[styles.justifyCenter, styles.alignCenter]}>
                  <Text>{it.label}</Text>
                  {it.icon}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[st.gray_bg, { padding: 12 }]}>
          {[
            {
              icon: <Entypo name="eye" size={36} color="black" />,
              label: "Views",
            },
            {
              icon: <AntDesign name="tags" size={36} color="black" />,
              label: "Interested",
            },
            {
              icon: <FontAwesome name="comments" size={36} color="black" />,
              label: "Comments",
              onPress: () =>
                navigation.navigate("Comments", {
                  item_id: serviceRequest.id,
                  item_type: "sreq",
                  comments_count: serviceRequest.comments_count,
                }),
            },
          ].map((it, i) => (
            <TouchableOpacity onPress={(e) => it.onPress && it.onPress()}>
              <View style={[styles.flexRow, styles.alignCenter, { gap: 8 }]}>
                {it.icon}
                <View>
                  <Text style={[]}>{it.label}</Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: KOOP_BLUE_DARK,
                      fontSize: 24,
                    }}
                  >
                    {i === 2 ? serviceRequest.comments_count : 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {!me && (
          <View>
            <TextInput
              value={comment}
              onChangeText={(txt) => setcomment(txt)}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[styles.ti, { padding: 12 }]}
              placeholder="Laisser un commentaire ..."
            />
            <LoadingButton
              loading={loading}
              text={"ENVOYER COMMENTAIRE"}
              handlePress={sendComment}
              icon={<FontAwesome name="send" size={24} color={KOOP_BLUE} />}
            />
          </View>
        )}

        {me && (
          <LoadingButton
            handlePress={(e) => onDelete(serviceRequest)}
            loading={loading}
            text={"Delete Announcement"}
            icon={<AntDesign name="delete" size={24} color="black" />}
          />
        )}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  gray_bg: {
    gap: 18,
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    backgroundColor: "#eeeeee99",
    marginTop: 12,
  },
});
