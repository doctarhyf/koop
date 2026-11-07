import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleSheet, View } from "react-native";
import ProfileUploader from "../components/ProfileUploader";
import TabPersonalInfo from "../components/TabPersonalInfo";
import TabShopInfo from "../components/TabShopInfo";
import { Avatar, Badge, FadeIn, PressableScale, Text } from "../components/ui";
import UserContext from "../context/UserContext";
import { colors, fonts, gradients, radius, shadows, space, type } from "../theme";
import { updateUserData } from "../utils/db";

const TABS = ["Profil", "Boutique"];

function Segmented({ value, onChange }) {
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(value)).current;
  const set = (i) => {
    Animated.spring(x, { toValue: i, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    onChange(i);
  };
  const segW = w / TABS.length;
  return (
    <View style={st.seg} onLayout={(e) => setW(e.nativeEvent.layout.width - 8)}>
      {w > 0 && (
        <Animated.View
          style={[
            st.segThumb,
            shadows.xs,
            { width: segW, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, segW] }) }] },
          ]}
        />
      )}
      {TABS.map((t, i) => (
        <PressableScale key={t} onPress={() => set(i)} hapticKind="select" style={st.segItem}>
          <Text style={[st.segText, value === i && { color: colors.text }]}>{t}</Text>
        </PressableScale>
      ))}
    </View>
  );
}

export default function MyAccount({ navigation }) {
  const [tab, settab] = useState(0);
  const { user, setuser } = useContext(UserContext);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingCover, setUpdatingCover] = useState(false);

  const persist = async (newUserData) => {
    setuser(newUserData);
    await AsyncStorage.setItem("@KOOP:user", JSON.stringify(newUserData));
  };

  const handleInfoPress = (data) => {
    if (data[0] === "prods") {
      navigation.navigate("MyItems", undefined, { pop: true });
      return;
    }
    if (!data[1].editable) return;
    navigation.navigate("InfoEdit", data, { pop: true });
  };

  const handleProfileChange = async (uri) => {
    const res = await updateUserData(user.id, { profile: uri });
    if (res && res.length === 1) await persist(res[0]);
    else console.error("Error updating user");
  };

  const handleCoverChange = async (uri) => {
    await updateUserData(user.id, { shop_profile: uri });
    await persist({ ...user, shop_profile: uri });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: space.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Cover */}
      <View style={st.cover}>
        {user.shop_profile ? (
          <Image source={user.shop_profile} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        ) : (
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient colors={["rgba(11,18,32,0)", "rgba(11,18,32,0.35)"]} style={StyleSheet.absoluteFill} />
        <View style={st.coverEdit}>
          {updatingCover ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ProfileUploader
              onProfilePicUri={handleCoverChange}
              currentURI={user.shop_profile}
              setUpdatingProfile={setUpdatingCover}
            />
          )}
        </View>
      </View>

      {/* Identity */}
      <FadeIn style={st.identity}>
        <View style={st.avatarWrap}>
          <PressableScale onPress={() => navigation.navigate("PhotoViewer", user.profile, { pop: true })}>
            <Avatar uri={user.profile} name={user.display_name} size={96} style={st.avatar} />
          </PressableScale>
          <View style={st.avatarEdit}>
            {updatingProfile ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <ProfileUploader
                setUpdatingProfile={setUpdatingProfile}
                currentURI={user.profile}
                onProfilePicUri={handleProfileChange}
              />
            )}
          </View>
        </View>

        <Text style={[type.h1, { textAlign: "center" }]}>{user.display_name}</Text>
        <Text style={[type.body, { color: colors.textMuted, textAlign: "center" }]}>
          {user.shop_name ? `${user.shop_name} · ` : ""}{user.phone}
        </Text>

        <View style={st.statsRow}>
          <View style={[st.stat, shadows.xs]}>
            <Text style={[type.caption, { color: colors.textMuted }]}>Statut</Text>
            <Badge label="● Actif" tone="success" />
          </View>
          <View style={[st.stat, shadows.xs]}>
            <Text style={[type.caption, { color: colors.textMuted }]}>Abonnement</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 14 }}>30/06/2024</Text>
          </View>
          <PressableScale
            onPress={() => navigation.navigate("MyItems", undefined, { pop: true })}
            style={[st.stat, shadows.xs]}
          >
            <Text style={[type.caption, { color: colors.textMuted }]}>Annonces</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.primary }}>Voir</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </View>
          </PressableScale>
        </View>
      </FadeIn>

      <View style={{ paddingHorizontal: space.lg, gap: space.lg }}>
        <Segmented value={tab} onChange={settab} />
        {tab === 0 ? (
          <TabPersonalInfo user={user} navigation={navigation} handleInfoPress={handleInfoPress} />
        ) : (
          <TabShopInfo user={user} navigation={navigation} handleInfoPress={handleInfoPress} />
        )}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  cover: { height: 180, backgroundColor: colors.sky100 },
  coverEdit: { position: "absolute", top: space.md, right: space.md },
  identity: { alignItems: "center", gap: 4, paddingHorizontal: space.lg, marginTop: -56, marginBottom: space.lg },
  avatarWrap: { marginBottom: space.sm },
  avatar: {
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.bg,
  },
  avatarEdit: { position: "absolute", right: 0, bottom: 4 },
  statsRow: { flexDirection: "row", gap: space.xs, marginTop: space.md, alignSelf: "stretch" },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space.sm,
    gap: 6,
  },
  seg: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.lineSoft,
  },
  segThumb: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
  },
  segItem: { flex: 1, alignItems: "center", paddingVertical: 10 },
  segText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textMuted },
});
