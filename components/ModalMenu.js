import React, { useContext, useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserContext from "../context/UserContext";
import { colors, radius, shadows, space, type } from "../theme";
import { Avatar, ListRow, Text } from "./ui";

const ITEMS = [
  { icon: "user", label: "Mon compte", sub: "Profil et boutique", route: "MyAccount" },
  { icon: "message-circle", label: "Messages", sub: "Vos conversations", route: "Inbox", tint: colors.success, bg: colors.successSoft },
  { icon: "layers", label: "Mes annonces", sub: "Gérer vos publications", route: "MyItems", tint: colors.violet, bg: colors.violetSoft },
  { icon: "settings", label: "Paramètres", sub: "PIN, aide, à propos", route: "Settings", tint: colors.slate, bg: colors.lineSoft },
  ...(__DEV__ ? [{ icon: "terminal", label: "Lab", sub: "Écran de test", route: "Test", tint: "#D97706", bg: colors.warningSoft }] : []),
];

export default function ModalMenu({ navigation, isMenuVisible, closeMenu }) {
  const { user } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMenuVisible) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible]);

  const go = (route) => {
    closeMenu();
    navigation.navigate(route, undefined, { pop: true });
  };

  return (
    <Modal visible={isMenuVisible} transparent animationType="none" onRequestClose={closeMenu} statusBarTranslucent>
      <Animated.View style={[st.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      </Animated.View>
      <Animated.View
        style={[
          st.sheet,
          shadows.lg,
          { paddingBottom: insets.bottom + space.md },
          { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }] },
        ]}
      >
        <View style={st.grabber} />
        <View style={st.profile}>
          <Avatar uri={user?.profile} name={user?.display_name} size={52} ring />
          <View style={{ flex: 1 }}>
            <Text style={type.h3} numberOfLines={1}>{user?.display_name}</Text>
            <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={1}>
              {user?.shop_name ? `${user.shop_name} · ` : ""}{user?.phone}
            </Text>
          </View>
        </View>
        <View style={st.list}>
          {ITEMS.map((it, i) => (
            <ListRow
              key={it.route}
              icon={it.icon}
              iconColor={it.tint || colors.primary}
              iconBg={it.bg || colors.primarySoft}
              title={it.label}
              subtitle={it.sub}
              onPress={() => go(it.route)}
              last={i === ITEMS.length - 1}
            />
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(11,18,32,0.45)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    gap: space.md,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line,
    marginBottom: space.xs,
  },
  profile: { flexDirection: "row", alignItems: "center", gap: space.sm },
  list: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
  },
});
