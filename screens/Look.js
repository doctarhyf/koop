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
} from "react-native";
import { Image } from "expo-image";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { useEffect, useState, useLayoutEffect } from "react";
import * as FUNCS from "../helpers/funcs";
import { IMG_SIZE } from "../helpers/flow";
import TextButton from "../components/TextButton";
import useItemsLoader from "../hooks/useItemsLoader";
import { TABLE_NAMES } from "../utils/supabase";
import useFetch from "../hooks/useFetch";
import { FontAwesome5 } from "@expo/vector-icons";

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

const SpecialRequest = ({ onSpecialReqItemPress }) => {
  return (
    <View>
      <Text style={[{ marginBottom: 8 }]}>DEMANDE SPECIALES</Text>
      {[...Array(5)].map((it, i) => (
        <TouchableOpacity onPress={onSpecialReqItemPress}>
          <View
            style={[
              styles.flexRow,

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
            <View>
              <Text style={[{ fontWeight: "bold" }]}>Rechere d'un macon</Text>
              <Text>Nous sommes a la rechere d'un macon</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeaturedItems = ({ navigation, loadingkoopitems, koopitems }) => {
  const onViewItem = (item) => {
    navigation.navigate("ServiceInfo", item);
  };

  const onViewAll = (cur) => {
    console.log(cur);
    navigation.navigate("ViewAll", "Featured Items");
  };
  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>{`POPULAR ITEMS`}</Text>
        <TouchableOpacity onPress={(e) => onViewAll()}>
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>

      {loadingkoopitems ? (
        <ActivityIndicator animating={loadingkoopitems} />
      ) : (
        <View>
          <ScrollView horizontal>
            {koopitems &&
              koopitems.map &&
              koopitems.map((item, item_idx) => (
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

const FeaturedShops = ({ navigation, loadingshops, shops }) => {
  const onViewShop = (shop) => {
    // alert(JSON.stringify(shop));
    navigation.navigate("Shop", shop);
  };

  const onViewAll = (cur) => {
    console.log(cur);
    navigation.navigate("ViewAll", "All Shops");
  };

  return (
    <View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <Text style={[styles.mbLarge, styles.mtLarge]}>POPULAR SHOPS</Text>
        <TouchableOpacity onPress={(e) => onViewAll()}>
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>
      {loadingshops ? (
        <ActivityIndicator animating={loadingshops} />
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

const Suggestions = ({ navigation }) => {
  const SUGGESTS_COUNT = 5;
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
        <TouchableOpacity onPress={(e) => onViewAll()}>
          <Text style={[styles.textSmall, styles.textBlue]}>View all</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator animating={loading} size={32} />
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
                  <Text style={[styles.textGray]}>{it.url}</Text>
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
  const [data, setdata] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingshops, shops, shopserror] = useFetch(
    "https://konext.vercel.app/api/shops",
    true
  );
  const [loadingkoopitems, koopitems, koopitemserror] = useFetch(
    "https://konext.vercel.app/api/items",
    true
  );
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("shops => ", shops);
    setdata((old) => ({ ...old, SHOPS: shops }));
  }, [shops]);

  useEffect(() => {
    console.log("koopitems => ", koopitems);

    setdata((old) => ({ ...old, SERVICES: koopitems }));
  }, [koopitems]);

  const onRefresh = () => {
    setRefreshing(true);
    // fetchData();
  };

  useEffect(() => {
    const loadShopsAndItems = async () => {
      const randomImages = await FUNCS.GetRandomImages(
        10,
        IMG_SIZE.w,
        IMG_SIZE.h
      );
      setImages(randomImages);

      setdata({
        SERVICES: [...Array(5)].map((it, i) => ({
          name: `Service ${i}`,
          id: `${i}`,
          pic: randomImages[i].urls.regular,
        })),
        SHOPS: [...Array(5)].map((it, i) => ({
          name: `Service ${i + 5}`,
          id: `${i + 5}`,
          pic: randomImages[i + 5].urls.regular,
        })),
        SUGGESTIONS: [...Array(5)].map((it, i) => ({
          name: `Service ${i + 5}`,
          id: `${i + 5}`,
          pic: randomImages[i + 5].urls.regular,
        })),
      });

      //console.log("img url: ", randomImages[0].urls.regular);
    };

    loadShopsAndItems();
  }, []);

  const onReqService = (e) => {
    navigation.navigate("Request");
  };

  const onItemPress = (block, item) => {
    const blockName = block[0];

    if (blockName === "SERVICES") {
      const item = block[1][0];
      //alert(JSON.stringify(item));
      navigation.navigate("ServiceInfo", item);
    }

    if (blockName === "SHOPS") {
      const item = block[1][0];
      navigation.navigate("Shop", item);
    }
  };

  const onViewAll = (block) => {
    console.log(block.label);
    navigation.navigate("Popular");
  };

  const onSpecialReqItemPress = (item) => {
    alert(item);
  };

  return (
    <View style={[styles.flex1, styles.bgBlue]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0087F5"]} // Customize the refreshing indicator color
          />
        }
      >
        <View>
          <TouchableOpacity onPress={(e) => navigation.replace("Search")}>
            <Text
              style={[
                styles.bgWhite,
                styles.paddingSmall,
                styles.marginMin,
                styles.roundedMd,
                styles.mtLarge,
                { overflow: "hidden" },
              ]}
            >
              Search koop ...
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.mtLarge,
              styles.paddingSmall,
              styles.flex1,
              styles.borderTopRadiusLarge,
              styles.bgWhite,
            ]}
          >
            <View style={styles.mbLarge}>
              <MenuButton
                handleOnPress={onReqService}
                btn={{
                  label: "DEMANDE SPECIFIQUE",
                  icon: require("../assets/icons/megaphone.png"),
                }}
              />
              <Text style={[styles.textCenter, styles.marginV]}>
                Lancer une demande speciale
              </Text>
            </View>

            <SpecialRequest onSpecialReqItemPress={onSpecialReqItemPress} />

            <FeaturedItems
              loadingkoopitems={loadingkoopitems}
              koopitems={koopitems}
              navigation={navigation}
            />
            <FeaturedShops
              loadingshops={loadingshops}
              shops={shops}
              navigation={navigation}
            />

            <Suggestions />
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
