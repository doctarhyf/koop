import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Chip, FadeIn, Input, ListRow, PressableScale, Text } from "../components/ui";
import UserContext from "../context/UserContext";
import { VILLES } from "../helpers/flow";
import { colors, radius, space, type } from "../theme";
import ShopSetup from "./ShopSetup";

const MEDIA_TYPE_CAMERA = 0;

function ProfileSetup({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [display_name, set_display_name] = useState("");

  const [ville, setville] = useState(null);
  const [profile, set_profile] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [error, seterror] = useState(false);
  const { phone } = route.params;
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    return true;
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

      set_profile(uri);
    }
  };

  const onNext = (e) => {
    if (profile === null) {
      Vibration.vibrate(250);
      Alert.alert(
        "Profile picture needed!",
        "Please you need to upoad ap profile pic"
      );
      return;
    }

    if (ville === null || ville.trim() === "") {
      Vibration.vibrate(250);
      Alert.alert("Votre ville?", "Veuillir choisir votre ville svp");
      return;
    }

    if (hasPromoCode && promoCode.trim() === "") {
      Vibration.vibrate(250);
      Alert.alert(
        "Promo code empty",
        "If you have a promo code, type it please!"
      );
      return;
    }

    if (display_name === "") {
      seterror(true);

      setTimeout(() => {
        seterror(false);
      }, 3000);
      return;
    }

    const profileData = {
      phone: phone,
      display_name: display_name,
      // shop_name: shop_name,
      ville: ville,
      profile: profile,
    };

    if (hasPromoCode && promoCode.trim().length > 0)
      profileData.invited_with_promo = promoCode;

    navigation.replace(ShopSetup.ROUTE, profileData);
  };

  const [showvilles, setshowvilles] = useState(false);
  const showVilleSelector = (e) => {
    setshowvilles(true);
  };

  const handleVillePress = (item) => {
    const ville = item.item;

    setville(ville);
    setshowvilles(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.lg, gap: space.xl, paddingBottom: space.xxxl }}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn style={{ gap: space.sm }}>
          <View style={st.steps}>
            <View style={[st.step, st.stepOn]} />
            <View style={st.step} />
          </View>
          <Text style={[type.overline, { color: colors.primary }]}>Étape 1 sur 2</Text>
          <Text style={type.h1}>Créez votre profil</Text>
          <Text style={[type.body, { color: colors.textMuted }]}>
            Permettez à vos clients d'en savoir plus sur vous, vos services et vos produits.
          </Text>
        </FadeIn>

        <FadeIn delay={80} style={{ alignItems: "center", gap: space.xs }}>
          <PressableScale onPress={handleAddImage} style={st.avatarBtn}>
            {profile ? (
              <Image source={{ uri: profile }} style={st.avatarImg} contentFit="cover" />
            ) : (
              <View style={[st.avatarImg, st.avatarEmpty]}>
                <Feather name="user" size={40} color={colors.primary} />
              </View>
            )}
            <View style={st.avatarBadge}>
              <Feather name="camera" size={15} color="#fff" />
            </View>
          </PressableScale>
          <Text style={[type.small, { color: colors.textMuted }]}>
            {profile ? "Touchez pour changer" : "Ajoutez une photo de profil"}
          </Text>
        </FadeIn>

        <FadeIn delay={140} style={{ gap: space.md }}>
          <Input label="Téléphone" icon="phone" value={phone} editable={false} inputStyle={{ color: colors.textMuted }} />
          <Input
            label="Nom de profil"
            icon="user"
            value={display_name}
            onChangeText={(txt) => set_display_name(txt)}
            placeholder="ex : Jean Mukendi"
            error={error ? "Le nom de profil est requis" : null}
            hint="C'est le nom que verront les autres utilisateurs"
          />
        </FadeIn>

        <FadeIn delay={200} style={{ gap: space.sm }}>
          <Text style={[type.overline, { color: colors.textMuted, marginLeft: 2 }]}>Votre ville</Text>
          <View style={st.chips}>
            {VILLES.map((v) => (
              <Chip key={v} label={v} selected={ville === v} onPress={() => setville(v)} />
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={240}>
          <Card style={{ gap: space.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={st.promoIcon}>
                <Feather name="gift" size={18} color={colors.violet} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.bodyStrong}>J'ai un code promo</Text>
                <Text style={[type.small, { color: colors.textMuted }]}>Invité par un ami ? Saisissez son code.</Text>
              </View>
              <Switch
                trackColor={{ false: colors.line, true: colors.primary }}
                thumbColor="#fff"
                ios_backgroundColor={colors.line}
                onValueChange={() => setHasPromoCode((prev) => !prev)}
                value={hasPromoCode}
              />
            </View>
            {hasPromoCode && (
              <Input
                icon="tag"
                value={promoCode}
                autoCapitalize="characters"
                onChangeText={(txt) => setPromoCode(txt)}
                placeholder="ex : STARPRO"
              />
            )}
          </Card>
        </FadeIn>

        <Button title="Continuer" iconRight="arrow-right" onPress={onNext} />
      </ScrollView>

      <Modal animationType="slide" transparent visible={bottomSheetVisible} onRequestClose={closeBottomSheet}>
        <Pressable style={bs.modalContainer} onPress={closeBottomSheet}>
          <Pressable style={bs.bottomSheet}>
            <View style={bs.grabber} />
            <Text style={type.h3}>Photo de profil</Text>
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

ProfileSetup.ROUTE = "ProfileSetup";

export default ProfileSetup;

const st = StyleSheet.create({
  steps: { flexDirection: "row", gap: 6, marginBottom: space.xs },
  step: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  stepOn: { backgroundColor: colors.primary },
  avatarBtn: { width: 120, height: 120 },
  avatarImg: { width: 120, height: 120, borderRadius: 60 },
  avatarEmpty: {
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.sky100,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ink,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.violetSoft,
    alignItems: "center",
    justifyContent: "center",
  },
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
