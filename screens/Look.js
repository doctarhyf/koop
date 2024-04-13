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
  Linking,
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import UserContext from "../context/UserContext";
import * as FUNCS from "../helpers/funcs";
import { IMG_SIZE } from "../helpers/flow";
import TextButton from "../components/TextButton";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import useFetch, { useFetch2 } from "../hooks/useFetch";
import { FontAwesome5 } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import AnnonceItem from "../components/AnnonceItem";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

/* const FeaturedItems = ({ navigation, me, onViewAll }) => {
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
}; */

const FeaturedShops = ({ navigation, onViewAll, refreshing }) => {
  const { user, setuser } = useContext(UserContext);
  const [loading, shops, error, reload] = useFetch2(
    "https://konext.vercel.app/api/shops",
    true
  );

  useFocusEffect(
    useCallback(() => {
      refreshing && reload();
    }, [refreshing])
  );

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  const onViewShop = (shop) => {
    if (shop.id === user.id) {
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
                      styles.roundedMd,
                      styles.marginH,
                      {
                        width: 200,
                        height: 140,
                        borderWidth: 4,
                        borderColor: user.id === shop.id ? KOOP_BLUE : "white",
                      },
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

const ServiceRequests = ({ navigation, onViewAll, refreshing }) => {
  const { user, setuser } = useContext(UserContext);
  const [loadingsreq, servicesRequests, errorsreqs, reloadsreqs] = useFetch2(
    "https://konext.vercel.app/api/sreq"
  );
  const limit = 5;

  useFocusEffect(
    useCallback(() => {
      refreshing && reloadsreqs();
    }, [refreshing])
  );

  useFocusEffect(
    useCallback(() => {
      reloadsreqs();
    }, [])
  );

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
          .filter((it, i) => i < limit)
          .map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => navigation.navigate("ViewServiceRequest", it)}
            >
              <AnnonceItem item={it} itsMyItem={it.user_id === user.id} />
            </TouchableOpacity>
          ))}
    </View>
  );
};

const FeaturedAd = ({ navigation }) => {
  const SAMPLE_PROMO_DATA = [
    {
      label: "ElectroHub",
      desc: "Your one-stop destination for cutting-edge electronics, from smartphones to smart home gadgets.",
      url: "https://www.instagram.com/doctarhyf/",
    },
    {
      label: "Sportify",
      desc: "Gear up for victory with our premium selection of sports equipment and athletic wear.",
      url: "https://soundcloud.com/slimrecords-ent/sets/l-f-d-y-ep",
    },
    {
      label: "FashionFusion",
      desc: "Unleash your style with our trendy clothing collection, blending fashion with comfort seamlessly.",
      url: "https://www.youtube.com/watch?v=vPSqPP23RsA",
    },
  ];

  const SUGGESTS_COUNT = SAMPLE_PROMO_DATA.length;

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
        <Text style={[styles.mbLarge, styles.mtLarge]}>ESPACE PUB</Text>
      </View>
      {loading ? (
        <ActivityIndicator animating={loading} size={32} color={KOOP_BLUE} />
      ) : (
        <ScrollView>
          {images.map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) => Linking.openURL(SAMPLE_PROMO_DATA[i].url)}
            >
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
                    source={it.url}
                    transition={1000}
                  />
                </View>
                <View style={[{ padding: 12 }]}>
                  <Text>{SAMPLE_PROMO_DATA[i].label}</Text>
                  <Text style={[styles.textGray]}>
                    {SAMPLE_PROMO_DATA[i].desc}
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
  const [refreshing, setrefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Welcom to KOOP",
      headerRight: () => (
        <TouchableOpacity
          onPress={(e) => navigation.navigate("ServiceRequest")}
        >
          <FontAwesome name="send" size={24} color={KOOP_BLUE} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const st_search = [
    styles.bgWhite,
    styles.paddingSmall,
    styles.marginMin,
    styles.roundedMd,

    { overflow: "hidden", marginTop: 24 },
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
    navigation.navigate("Search", type);
  };

  const onRefresh = (e) => {
    setrefreshing(true);

    setTimeout(() => {
      setrefreshing(false);
    }, 2500);
  };

  return (
    <View style={[styles.flex1, styles.bgBlue]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <TouchableOpacity onPress={(e) => navigation.replace("Search")}>
            <Text style={st_search}>Rechercher koop ...</Text>
          </TouchableOpacity>

          <View style={st_feat_cont}>
            <FeaturedShops
              navigation={navigation}
              onViewAll={onViewAll}
              refreshing={refreshing}
            />
            <ServiceRequests
              navigation={navigation}
              onViewAll={onViewAll}
              refreshing={refreshing}
            />
            <FeaturedAd navigation={navigation} />
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
