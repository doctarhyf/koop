import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Vibration,
  View,
} from "react-native";
import { Button, Card, Chip, FadeIn, Input, ListRow, PressableScale, Text } from "../components/ui";
import { colors, radius, space, type } from "../theme";
import InfoEdit from "./InfoEdit";
import Initializing from "./Initializing";

const MEDIA_TYPE_CAMERA = 0;

function ShopSetup({ navigation, route }) {
  const [error, seterror] = useState(false);
  const [has_shop, set_has_shop] = useState(true);
  let params = route.params;
  const [profileData, setProfileData] = useState({ ...params });
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTMP();
    }, [])
  );

  const loadTMP = async () => {
    const dataStr = await AsyncStorage.getItem("tmp");

    const data = JSON.parse(dataStr);

    if (data !== null) {
      const key = data.key;
      const val = data.val;

      setProfileData((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleAddImage = (e) => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const onChooseMedia = (mediaType) => {
    pickImageAsync(mediaType);
  };

  const pickImageAsync = async (mediaType) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera permission",
        "We need your permission to access the camera"
      );
      return;
    }

    let result;

    if (mediaType === MEDIA_TYPE_CAMERA) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    closeBottomSheet();
    if (!result.canceled) {
      const { uri } = result.assets[0];

      console.error("new profile pic => ", uri);

      onUpdateProfileData("shop_profile", uri);
    }
  };

  const notDefinedOrEmpty = (val) => {
    if (val === undefined) return true;
    return val.trim() === "";
  };

  const ERROS = {
    SHOP_PROFILE: {
      label: "No profle picture",
      message: "Please upload a profile picture for your shop",
    },
    SHOP_NAME: {
      label: "No shop name",
      message: "Please provide your shop name",
    },
    SHOP_ADDRESS: {
      label: "No shop address",
      message: "Please provide your shop physical address",
    },
    SHOP_DESCRIPTION: {
      label: "No shop description",
      message: "Please provide your shop description",
    },
    SHOP_TAGS: {
      label: "Add activities categories",
      message: "Please choose your shop categories",
    },
  };

  const onNext = () => {
    const { shop_profile, shop_name, shop_add, shop_desc, shop_tags } =
      profileData;

    if (has_shop && notDefinedOrEmpty(shop_profile)) {
      Vibration.vibrate(250);
      Alert.alert(ERROS.SHOP_PROFILE.label, ERROS.SHOP_PROFILE.message);
      return;
    }

    if (has_shop && notDefinedOrEmpty(shop_name)) {
      Vibration.vibrate(250);
      Alert.alert(ERROS.SHOP_NAME.label, ERROS.SHOP_NAME.message);
      return;
    }

    if (has_shop && notDefinedOrEmpty(shop_desc)) {
      Vibration.vibrate(250);
      Alert.alert(ERROS.SHOP_DESCRIPTION.label, ERROS.SHOP_DESCRIPTION.message);
      return;
    }

    if (has_shop && notDefinedOrEmpty(shop_tags)) {
      Vibration.vibrate(250);
      Alert.alert(ERROS.SHOP_TAGS.label, ERROS.SHOP_TAGS.message);
      return;
    }

    const finalProfData = { ...profileData, has_shop: has_shop };
    if (notDefinedOrEmpty(profileData.shop_whatsapp)) {
      finalProfData.shop_whatsapp = profileData.phone;
    }

    if (!has_shop) {
      delete finalProfData.shop_profile;
      delete finalProfData.shop_add;
      delete finalProfData.shop_tags;
    }

    // alert("initializing ... \n" + JSON.stringify(finalProfData));

    navigation.navigate(Initializing.ROUTE, finalProfData, { pop: true });
  };

  const onUpdateProfileData = (type, val) => {
    setProfileData((prev) => ({ ...prev, [type]: val }));
  };

  const setShowShopTagsSelctor = () => {
    const cur_shop_tags = {
      value: profileData.shop_tags,
      icon: "tags",
      placeholder: "Shop Tags",
      editable: true,
      label: "Shop Tags",
    };

    navigation.navigate(InfoEdit.ROUTE, ["shop_tags", cur_shop_tags, true], { pop: true });
  };

  const tags = (profileData.shop_tags || "").split(";").slice(1).filter((t) => t !== "");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: space.lg, gap: space.xl, paddingBottom: space.xxxl }}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn style={{ gap: space.sm }}>
          <View style={st.steps}>
            <View style={[st.step, st.stepOn]} />
            <View style={[st.step, st.stepOn]} />
          </View>
          <Text style={[type.overline, { color: colors.primary }]}>Étape 2 sur 2</Text>
          <Text style={type.h1}>Votre boutique</Text>
          <Text style={[type.body, { color: colors.textMuted }]}>
            Présentez votre activité pour que les clients vous trouvent plus facilement.
          </Text>
        </FadeIn>

        <FadeIn delay={60}>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <View style={st.shopIcon}>
              <Feather name="shopping-bag" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.bodyStrong}>J'ai une boutique</Text>
              <Text style={[type.small, { color: colors.textMuted }]}>Vous pourrez en créer une plus tard</Text>
            </View>
            <Switch
              trackColor={{ false: colors.line, true: colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor={colors.line}
              onValueChange={() => set_has_shop((prev) => !prev)}
              value={has_shop}
            />
          </Card>
        </FadeIn>

        {has_shop ? (
          <FadeIn delay={120} style={{ gap: space.md }}>
            <PressableScale onPress={handleAddImage} scaleTo={0.985} style={st.cover}>
              {profileData.shop_profile ? (
                <Image source={{ uri: profileData.shop_profile }} style={StyleSheet.absoluteFill} contentFit="cover" />
              ) : (
                <View style={st.coverEmpty}>
                  <View style={st.coverIcon}>
                    <Feather name="image" size={22} color={colors.primary} />
                  </View>
                  <Text style={type.bodyStrong}>Ajouter une photo de couverture</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>Votre vitrine, en 16:9 idéalement</Text>
                </View>
              )}
              {profileData.shop_profile ? (
                <View style={st.coverBadge}>
                  <Feather name="camera" size={14} color="#fff" />
                </View>
              ) : null}
            </PressableScale>

            <Input
              label="Nom de la boutique"
              icon="shopping-bag"
              value={profileData.shop_name}
              onChangeText={(txt) => onUpdateProfileData("shop_name", txt)}
              placeholder="ex : Mukendi Électronique"
            />
            <Input
              label="Adresse"
              icon="map-pin"
              value={profileData.shop_add}
              onChangeText={(txt) => onUpdateProfileData("shop_add", txt)}
              placeholder="Av. du Commerce 12, Gombe"
            />
            <Input
              label="Description"
              icon="align-left"
              multiline
              value={profileData.shop_desc}
              onChangeText={(txt) => onUpdateProfileData("shop_desc", txt)}
              placeholder="Un message d'accueil pour vos clients…"
              hint="Affiché sur la page de votre boutique"
            />

            <View style={{ gap: space.xs }}>
              <Text style={[type.overline, { color: colors.textMuted, marginLeft: 2 }]}>Catégories</Text>
              <View style={st.chips}>
                {tags.map((t, i) => (
                  <Chip key={i} label={t} selected />
                ))}
                <Chip label={tags.length ? "Modifier" : "Ajouter des catégories"} icon="plus" onPress={setShowShopTagsSelctor} />
              </View>
            </View>
          </FadeIn>
        ) : (
          <FadeIn delay={120}>
            <Card style={{ flexDirection: "row", gap: space.sm }}>
              <Feather name="info" size={18} color={colors.primary} />
              <Text style={[type.small, { flex: 1, color: colors.textSecondary }]}>
                Pas de boutique pour le moment ? Inscrivez-vous en tant que client — vous pourrez toujours créer votre boutique plus tard.
              </Text>
            </Card>
          </FadeIn>
        )}

        <Button title="Créer mon compte" iconRight="check" onPress={onNext} />
      </ScrollView>

      <Modal animationType="slide" transparent visible={bottomSheetVisible} onRequestClose={closeBottomSheet}>
        <Pressable style={bs.modalContainer} onPress={closeBottomSheet}>
          <Pressable style={bs.bottomSheet}>
            <View style={bs.grabber} />
            <Text style={type.h3}>Photo de couverture</Text>
            <View style={bs.list}>
              {[
                { label: "Prendre une photo", icon: "camera" },
                { label: "Choisir dans la galerie", icon: "image" },
              ].map((btn, i) => (
                <ListRow key={i} icon={btn.icon} title={btn.label} last={i === 1} onPress={() => onChooseMedia(i)} />
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

ShopSetup.ROUTE = "ShopSetup";

export default ShopSetup;

const st = StyleSheet.create({
  steps: { flexDirection: "row", gap: 6, marginBottom: space.xs },
  step: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  stepOn: { backgroundColor: colors.primary },
  shopIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    height: 180,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  coverEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.sky100,
    backgroundColor: colors.primarySoft,
  },
  coverIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  coverBadge: {
    position: "absolute",
    right: space.sm,
    bottom: space.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(11,18,32,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
});

const bs = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(11,18,32,0.45)" },
  bottomSheet: {
    backgroundColor: colors.bg,
    padding: space.lg,
    paddingBottom: space.xxl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line,
    marginBottom: space.md,
  },
  list: { marginTop: space.md, backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: space.md },
});
