import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { KOOP_BLUE, KOOP_BLUE_DARK, KOOP_BLUE_LIGHT } from "../helpers/colors";
import * as FUNCS from "../helpers/funcs";
import styles from "../helpers/styles";
import TextButton from "../components/TextButton";
const IMG_SIZE = 260;
import Icon from "react-native-vector-icons/FontAwesome";
import { getItem, insertItem } from "../utils/db";
import { TABLE_NAMES } from "../utils/supabase";
import { UserContext } from "../App";
import { addViewsCount } from "../utils/api";

export default function ServiceInfo({ navigation, route }) {
  const { user } = useContext(UserContext);
  const item = route.params;
  const { likes, shop_name, shop_profile, shop_id, id } = item;
  const [loading, setloading] = useState(false);
  const [comment, setcomment] = useState("");
  const [commentPosted, setCommentPosted] = useState(false);
  const [views, setviews] = useState("");

  //alert(JSON.stringify(item.shop_id));

  useEffect(() => {
    async function addViews() {
      const res = await addViewsCount(user.id, id);
      // alert("res =>" + JSON.stringify(res));
      if (res.views) setviews(res.views);
    }

    addViews();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.name,
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : (
          <TextButton
            iconName="phone-square"
            label={"CONTACT"}
            handlePress={onContactShop}
          />
        ),
    });

    console.error("route.params => ", route.params);
  }, [navigation, loading]);

  const onContactShop = (e) => {
    console.log(e);

    const shop = {
      ...item,
      from_id: user.id,
      to_id: shop_id,
    };

    navigation.navigate("SendMessage", shop);
  };

  const onSendComment = async (e) => {
    if (comment.length > 0) {
      setloading(true);
      const com = { item_id: item.id, posted_by_id: user.id, comment: comment };
      const r = await insertItem(TABLE_NAMES.KOOP_COMMENTS, com);

      if (!r.code) {
        setloading(false);
        Alert.alert(
          "Thank your comment",
          "Your comment has been posted\n" + JSON.stringify(com)
        );
        setCommentPosted(true);
      }
    } else {
      alert("Cant post empty comment !");
      setloading(false);
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        {
          <Text
            style={[
              st.labelServName,
              styles.textCenter,
              styles.paddingSmall,
              styles.textBlue,
            ]}
          >
            {item.shop_name}
          </Text>
        }
        <ScrollView horizontal style={{ flex: 1 }}>
          {item.photos.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("PhotoViewer", img)}
            >
              <View style={[st.imgcont]}>
                <Image source={{ uri: img }} style={[st.img]} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.paddingMid]}>
          <View>
            <Text style={[st.labelServName]}>{item.name}</Text>
            {item.desc && <Text style={[st.label]}>{item.desc}</Text>}
            {item.link && <Text style={[st.label]}>{item.link}</Text>}
          </View>

          <View
            style={[
              styles.flexRow,
              { flex: 1 / 8 },
              styles.justifyBetween,
              { marginVertical: 12 },
            ]}
          >
            {["likes", "views"].map((it, i) => (
              <TouchableOpacity
                key={i}
                onPress={(e) =>
                  it === "likes" ? console.log("likes") : console.log("views")
                }
              >
                <View style={[styles.flexRow, styles.paddingMid]}>
                  <Icon
                    name={it === "likes" ? "heart" : "eye"}
                    size={28}
                    style={{ color: KOOP_BLUE_DARK }}
                  />
                  <View style={[{ width: 5 }]}></View>

                  <Text style={[styles.textBlue]}>
                    {it === "likes" ? likes : views}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.textBlueDark]}>Commentaires</Text>
          <View style={[]}>
            <View
              style={[
                styles.flexRow,
                styles.alignCenter,
                styles.justifyBetween,
              ]}
            >
              <Image
                source={{ uri: user.profile }}
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    overflow: "hidden",
                  },
                ]}
              />
              <Text>{user.display_name}</Text>
            </View>
            {!commentPosted && (
              <TextInput
                textAlignVertical="top"
                style={[styles.ti]}
                multilines={true}
                numberOfLines={10}
                value={comment}
                onChangeText={(txt) => setcomment(txt)}
                placeholder={"Leave a comment ..."}
              />
            )}
            {commentPosted && <Text>{comment}</Text>}

            {!commentPosted &&
              (loading ? (
                <ActivityIndicator animating={true} />
              ) : (
                <TouchableOpacity onPress={onSendComment}>
                  <Text
                    style={[
                      styles.textCenter,
                      styles.paddingMid,
                      styles.textBlue,
                    ]}
                  >
                    SEND COMMENT
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          <TouchableOpacity
            onPress={(e) => navigation.navigate("Comments", item)}
          >
            <Text
              style={[styles.textBlue, styles.textCenter, styles.paddingSmall]}
            >
              View all comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  labelServName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sw: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#666666dd",
    fontSize: 14,
  },

  imgcont: {
    backgroundColor: KOOP_BLUE_LIGHT,
    height: IMG_SIZE,
    width: IMG_SIZE,
    marginRight: "10",
  },
  img: {
    height: "100%",
    resizeMode: "cover",
    marginLeft: 5,
    marginRight: 5,
  },
  addimg: {
    justifyContent: "center",
    alignItems: "center",
  },
});
