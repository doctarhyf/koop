import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import AnnonceItem from "../components/AnnonceItem";
import {
  Badge,
  EmptyState,
  FadeIn,
  IconButton,
  ListSkeleton,
  PressableScale,
  SectionHeader,
  Skeleton,
  Text,
} from "../components/ui";
import UserContext from "../context/UserContext";
import * as FUNCS from "../helpers/funcs";
import { IMG_SIZE } from "../helpers/flow";
import { useFetch2 } from "../hooks/useFetch";
import { colors, fonts, gradients, radius, shadows, space, type } from "../theme";

const SearchBar = ({ onPress }) => (
  <PressableScale onPress={onPress} scaleTo={0.985} style={[st.search, shadows.xs]}>
    <Feather name="search" size={18} color={colors.textMuted} />
    <Text style={[type.body, { color: colors.textFaint, flex: 1 }]}>
      Rechercher une annonce, un service…
    </Text>
    <View style={st.searchKbd}>
      <Feather name="sliders" size={14} color={colors.text} />
    </View>
  </PressableScale>
);

const FeaturedShops = ({ navigation, onViewAll, refreshing }) => {
  const { user } = useContext(UserContext);
  const [loading, shops, error, reload] = useFetch2("https://konext.vercel.app/api/shops", true);

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
        "Votre boutique",
        "C'est votre boutique. Pour modifier ses informations, allez dans Mon compte.",
        [
          { text: "Annuler" },
          { text: "Mon compte", onPress: () => navigation.navigate("MyAccount", undefined, { pop: true }) },
        ]
      );
      return;
    }
    navigation.navigate("Shop", shop, { pop: true });
  };

  return (
    <View>
      <SectionHeader
        title="Boutiques populaires"
        action="Tout voir"
        onAction={() => onViewAll(FUNCS.VIEW_ALL_TYPE.SHOPS)}
        style={st.pad}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.hList}>
        {loading
          ? [0, 1, 2].map((i) => <Skeleton key={i} width={220} height={150} r={radius.lg} />)
          : Array.isArray(shops) &&
            shops.map((shop, i) => (
              <PressableScale key={shop.id ?? i} onPress={() => onViewShop(shop)} style={[st.shop, shadows.sm]}>
                {shop.shop_profile ? (
                  <Image source={shop.shop_profile} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
                ) : (
                  <LinearGradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
                )}
                <LinearGradient colors={gradients.scrim} style={StyleSheet.absoluteFill} />
                {user.id === shop.id ? <Badge label="Ma boutique" tone="glass" style={st.shopBadge} /> : null}
                <View style={st.shopInfo}>
                  <Text style={st.shopName} numberOfLines={1}>{shop.shop_name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Feather name="zap" size={12} color="#A7F3D0" />
                    <Text style={st.shopCount}>{shop.items_count ?? 0} annonces</Text>
                  </View>
                </View>
              </PressableScale>
            ))}
      </ScrollView>
    </View>
  );
};

const ServiceRequests = ({ navigation, onViewAll, refreshing }) => {
  const { user } = useContext(UserContext);
  const [loadingsreq, servicesRequests, errorsreqs, reloadsreqs] = useFetch2("https://konext.vercel.app/api/sreq");
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

  const list = Array.isArray(servicesRequests) ? servicesRequests.slice(0, limit) : [];

  return (
    <View style={st.pad}>
      <SectionHeader
        title="Dernières annonces"
        action="Tout voir"
        onAction={() => onViewAll(FUNCS.VIEW_ALL_TYPE.SERVICE_REQUESTS)}
      />
      {loadingsreq && list.length === 0 ? (
        <ListSkeleton rows={3} />
      ) : list.length === 0 ? (
        <EmptyState icon="inbox" title="Aucune annonce" subtitle="Soyez le premier à publier aujourd'hui." />
      ) : (
        list.map((it, i) => (
          <FadeIn key={it.id ?? i} delay={i * 60}>
            <PressableScale
              scaleTo={0.985}
              onPress={() => navigation.navigate("ViewServiceRequest", it, { pop: true })}
            >
              <AnnonceItem item={it} itsMyItem={it.user_id === user.id} />
            </PressableScale>
          </FadeIn>
        ))
      )}
    </View>
  );
};

const SAMPLE_PROMO_DATA = [
  {
    label: "ElectroHub",
    desc: "Smartphones, gadgets et maison connectée — tout l'électronique en un seul endroit.",
    url: "https://www.instagram.com/doctarhyf/",
  },
  {
    label: "Sportify",
    desc: "Équipements sportifs premium et vêtements techniques pour gagner.",
    url: "https://soundcloud.com/slimrecords-ent/sets/l-f-d-y-ep",
  },
  {
    label: "FashionFusion",
    desc: "Une collection tendance qui marie style et confort.",
    url: "https://www.youtube.com/watch?v=vPSqPP23RsA",
  },
];

const FeaturedAd = () => {
  const [images, setimages] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    (async () => {
      const randomImages = await FUNCS.GetRandomImages(SAMPLE_PROMO_DATA.length, IMG_SIZE.w, IMG_SIZE.h);
      setloading(false);
      setimages(Array.isArray(randomImages) ? randomImages.map((img, i) => ({ url: img?.urls?.regular, id: i })) : []);
    })();
  }, []);

  const cards = SAMPLE_PROMO_DATA.map((p, i) => ({ ...p, url_img: images[i]?.url }));

  return (
    <View>
      <SectionHeader title="Sponsorisé" style={st.pad} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={300 + space.sm}
        decelerationRate="fast"
        contentContainerStyle={st.hList}
      >
        {cards.map((it, i) => (
          <PressableScale key={i} onPress={() => Linking.openURL(it.url)} style={[st.ad, shadows.sm]}>
            <View style={st.adImg}>
              {loading || !it.url_img ? (
                <LinearGradient colors={i % 2 ? gradients.premium : gradients.brand} style={StyleSheet.absoluteFill} />
              ) : (
                <Image source={it.url_img} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
              )}
              <Badge label="PUB" tone="dark" style={{ margin: space.sm }} />
            </View>
            <View style={{ padding: space.md, gap: 4 }}>
              <Text style={type.title}>{it.label}</Text>
              <Text numberOfLines={2} style={[type.small, { color: colors.textMuted }]}>{it.desc}</Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
};

export default function Look({ navigation }) {
  const [refreshing, setrefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Découvrir",
      headerLargeTitle: false,
      headerRight: () => (
        <IconButton
          name="plus"
          size={36}
          bg={colors.ink}
          color="#fff"
          border={false}
          onPress={() => navigation.navigate("ServiceRequest", undefined, { pop: true })}
        />
      ),
    });
  }, [navigation]);

  const onViewAll = (type) => navigation.navigate("Search", type, { pop: true });

  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => setrefreshing(false), 2500);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: space.xxxl, gap: space.xl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={[st.pad, { paddingTop: space.xs }]}>
        <SearchBar onPress={() => onViewAll(FUNCS.VIEW_ALL_TYPE.SERVICE_REQUESTS)} />
      </View>
      <FeaturedShops navigation={navigation} onViewAll={onViewAll} refreshing={refreshing} />
      <ServiceRequests navigation={navigation} onViewAll={onViewAll} refreshing={refreshing} />
      <FeaturedAd />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  pad: { paddingHorizontal: space.lg },
  hList: { paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.xs },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    height: 52,
    paddingLeft: space.md,
    paddingRight: 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
  },
  searchKbd: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  shop: {
    width: 220,
    height: 150,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: colors.sky100,
  },
  shopBadge: { position: "absolute", top: space.sm, left: space.sm },
  shopInfo: { padding: space.md, gap: 2 },
  shopName: { fontFamily: fonts.bold, fontSize: 16, color: "#fff" },
  shopCount: { ...type.caption, color: "rgba(255,255,255,0.85)" },
  ad: { width: 300, backgroundColor: colors.card, borderRadius: radius.lg, overflow: "hidden" },
  adImg: { height: 150, backgroundColor: colors.sky100 },
});
