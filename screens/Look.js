import {
  View,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import * as FUNCS from "../helpers/funcs";
import { IMG_SIZE } from "../helpers/flow";
import TextButton from "../components/TextButton";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import useFetch, { useFetch2 } from "../hooks/useFetch";
import { FontAwesome5 } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";

const FeaturedItems = ({ navigation, me, onViewAll }) => {
  const [loading, items, error] = useFetch(
    "https://konext.vercel.app/api/items",
    true
  );

  const onViewItem = (item) => {
    navigation.navigate("ServiceInfo", item);
  };

  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>{`POPULAR ITEMS`}</Text>
        <TouchableOpacity onPress={(e) => onViewAll(FUNCS.VIEW_ALL_TYPE.ITEMS)}>
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator animating={loading} color={KOOP_BLUE} />
      ) : (
        <View>
          <ScrollView horizontal>
            {items &&
              items.map &&
              items.map((item, item_idx) => (
                <TouchableOpacity
                  key={item_idx}
                  onPress={(e) => onViewItem(item)}
                >
                  <ImageBackground
                    style={[
                      styles.bgBlue,
                      styles.roundedSmall,
                      styles.marginH,
                      st.imgbg,
                      styles.justifyEnd,
                      styles.overflowHidden,
                    ]}
                    source={{
                      uri: item.photos[0], //"https://cdn.britannica.com/49/182849-050-4C7FE34F/scene-Iron-Man.jpg",
                    }}
                  >
                    <View style={[{ padding: 10 }, styles.textBGBlackTransp]}>
                      <Text style={styles.textWhite}>{item.name}</Text>
                      <Text style={[styles.textGreen]}>{item.shop_name}</Text>
                      <Text style={[styles.textGray, { fontSize: 12 }]}>
                        + 40 items
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const FeaturedShops = ({ navigation, me, onViewAll }) => {
  const [loading, shops, error] = useFetch(
    "https://konext.vercel.app/api/shops",
    true
  );

  const onViewShop = (shop) => {
    if (me.id === shop.id) {
      Alert.alert(
        "Your shop",
        "This is your shop, if you want to change some information go to My Account?",
        [
          {
            text: "Cancel",
          },
          {
            text: "My Account",
            onPress: () => {
              navigation.navigate("MyAccount");
            },
            style: "destructive",
          },
        ]
      );
      return;
    }
    navigation.navigate("Shop", shop);
  };

  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>POPULAR SHOPS</Text>
        <TouchableOpacity onPress={(e) => onViewAll(FUNCS.VIEW_ALL_TYPE.SHOPS)}>
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator animating={loading} color={KOOP_BLUE} />
      ) : (
        <View>
          <ScrollView horizontal>
            {shops &&
              shops.map &&
              shops.map((shop, shop_idx) => (
                <TouchableOpacity
                  key={shop_idx}
                  onPress={(e) => onViewShop(shop)}
                >
                  <ImageBackground
                    style={[
                      styles.bgBlue,
                      styles.roundedSmall,
                      styles.marginH,
                      { width: 200, height: 140 },
                      styles.justifyEnd,
                      styles.overflowHidden,
                    ]}
                    source={{
                      uri: shop.shop_profile, //"https://cdn.britannica.com/49/182849-050-4C7FE34F/scene-Iron-Man.jpg",
                    }}
                  >
                    <View style={[{ padding: 10 }, styles.textBGBlackTransp]}>
                      <Text style={styles.textWhite}>{shop.shop_name}</Text>
                      {/*  <Text style={[styles.textGreen]}>{curShop.shop_name}</Text> */}
                      <Text style={[styles.textGray, { fontSize: 12 }]}>
                        + 40 items
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const ServiceRequests = ({ navigation, me, onViewAll }) => {
  const { phone } = me;
  const [loadingsreq, servicesRequests, errorsreqs, reloadsreqs] = useFetch2(
    "https://konext.vercel.app/api/sreq"
  );
  const limit = 4;

  return (
    <View style={[{ marginTop: 12 }]}>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>ANNONCES</Text>
        <TouchableOpacity
          onPress={(e) => onViewAll(FUNCS.VIEW_ALL_TYPE.SERVICE_REQUESTS)}
        >
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>
      {loadingsreq && (
        <ActivityIndicator
          color={KOOP_BLUE}
          animating={true}
          style={[styles.paddingLarge]}
        />
      )}
      {servicesRequests &&
        servicesRequests
          .filter(
            (serviceRequest, i) => serviceRequest.phone !== phone && i < limit
          )
          .map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("ViewServiceRequest", it)}
            >
              <View
                style={[
                  styles.flexRow,
                  styles.flex1,
                  styles.alignCenter,
                  {
                    gap: 8,
                    padding: 8,
                    borderColor: "#ddd",
                    marginBottom: 8,
                    borderWidth: 1,
                    borderRadius: 8,
                  },
                ]}
              >
                <FontAwesome5 name="bolt" size={24} color="green" />

                <View style={[styles.flex1]}>
                  <Text>
                    <Text style={[styles.textBlue, styles.fontBold]}>
                      {it.user_data.ville}
                    </Text>{" "}
                    - {it.user_data.display_name}
                  </Text>
                  <Text style={[{ fontWeight: "bold", flex: 1 }]}>
                    {it.label}
                  </Text>

                  <Text style={[styles.textGray]}>
                    {FUNCS.ParseCreatedAt(it.created_at).full}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
    </View>
  );
};

const FeaturedAd = ({ navigation, me }) => {
  const SUGGESTS_COUNT = 3;
  const [images, setimages] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);

    const fetchImages = async () => {
      const randomImages = await FUNCS.GetRandomImages(
        SUGGESTS_COUNT,
        IMG_SIZE.w,
        IMG_SIZE.h
      );

      setloading(false);
      setimages(
        randomImages.map((img, i) => ({ url: img.urls?.regular, id: i }))
      );
    };

    fetchImages();
  }, []);

  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>PROMO</Text>
      </View>
      {loading ? (
        <ActivityIndicator animating={loading} size={32} color={KOOP_BLUE} />
      ) : (
        <ScrollView>
          {images.map((it, i) => (
            <TouchableOpacity key={i} onPress={(e) => console.log(e)}>
              <View
                style={[
                  {
                    marginVertical: 12,
                    borderRadius: 12,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    overflow: "hidden",
                  },
                ]}
              >
                <View
                  style={[
                    {
                      height: 200,

                      backgroundColor: "red",
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Image
                    style={[
                      {
                        resizeMode: "cover",
                        overflow: "hidden",
                        width: "100%",
                        height: 200,
                      },
                    ]}
                    source={require("../assets/images/init.jpg")}
                    transition={1000}
                  />
                </View>
                <View style={[{ padding: 12 }]}>
                  <Text>Suggestion</Text>
                  <Text style={[styles.textGray]}>
                    {it.url.substring(0, 100) + " ..."}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default function Look({ navigation }) {
  const { user, setuser } = useContext(UserContext);

  const st_search = [
    styles.bgWhite,
    styles.paddingSmall,
    styles.marginMin,
    styles.roundedMd,
    { overflow: "hidden" },
  ];

  const st_feat_cont = [
    styles.mtLarge,
    styles.paddingSmall,
    styles.flex1,
    styles.borderTopRadiusLarge,
    styles.bgWhite,
    { paddingTop: 12 },
  ];

  const onViewAll = (type) => {
    navigation.navigate("ViewAll", type);
  };

  return (
    <View style={[styles.flex1, styles.bgBlue]}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={(e) => navigation.replace("Search")}>
            <Text style={st_search}>Rechercher koop ...</Text>
          </TouchableOpacity>

          <View style={st_feat_cont}>
            {/*   <FeaturedItems
              me={user}
              navigation={navigation}
              onViewAll={onViewAll}
            /> */}
            <FeaturedShops
              me={user}
              navigation={navigation}
              onViewAll={onViewAll}
            />
            <ServiceRequests
              me={user}
              navigation={navigation}
              onViewAll={onViewAll}
            />
            <FeaturedAd me={user} navigation={navigation} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  imgbg: {
    width: 140,
    height: 180,
  },
});
