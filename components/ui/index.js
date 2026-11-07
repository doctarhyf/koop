import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  colors,
  fonts,
  gradients,
  radius,
  shadows,
  space,
  type,
} from "../../theme";
import Text, { TextInput } from "./Text";

export { Text, TextInput };

export const haptic = (kind = "light") => {
  if (Platform.OS === "web") return;
  try {
    if (kind === "success")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (kind === "warning")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    else if (kind === "select") Haptics.selectionAsync();
    else
      Haptics.impactAsync(
        kind === "medium"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
  } catch (e) {}
};

/* ───────────────────────── Pressable with spring scale ───────────────────────── */
export function PressableScale({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = 0.97,
  disabled,
  hapticKind = "light",
  ...props
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={(e) => {
        if (hapticKind) haptic(hapticKind);
        onPress && onPress(e);
      }}
      onLongPress={onLongPress}
      {...props}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

/* ───────────────────────── Button ───────────────────────── */
export function Button({
  title,
  onPress,
  variant = "primary", // primary | secondary | ghost | danger | dark | light
  size = "lg",
  icon,
  iconRight,
  loading,
  disabled,
  style,
  full = true,
}) {
  const h = size === "sm" ? 40 : size === "md" ? 48 : 56;
  const fg = {
    primary: "#fff",
    dark: "#fff",
    danger: colors.danger,
    secondary: colors.primary,
    ghost: colors.text,
    light: colors.text,
  }[variant];

  const content = (
    <View style={[st.btnInner, { height: h }]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={size === "sm" ? 16 : 18} color={fg} /> : null}
          <Text style={[st.btnText, { color: fg, fontSize: size === "sm" ? 14 : 16 }]}>
            {title}
          </Text>
          {iconRight ? (
            <Feather name={iconRight} size={size === "sm" ? 16 : 18} color={fg} />
          ) : null}
        </>
      )}
    </View>
  );

  const base = [
    { borderRadius: radius.md, overflow: "hidden", opacity: disabled ? 0.5 : 1 },
    full && { alignSelf: "stretch" },
  ];

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      hapticKind={variant === "primary" ? "medium" : "light"}
      style={[variant === "primary" && !disabled && shadows.glow, style]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={gradients.brand.slice(1)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={base}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            base,
            variant === "secondary" && { backgroundColor: colors.primarySoft },
            variant === "dark" && { backgroundColor: colors.ink },
            variant === "danger" && { backgroundColor: colors.dangerSoft },
            variant === "light" && {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          {content}
        </View>
      )}
    </PressableScale>
  );
}

/* ───────────────────────── IconButton ───────────────────────── */
export function IconButton({
  name,
  onPress,
  size = 40,
  color = colors.text,
  bg = colors.card,
  border = true,
  badge,
  style,
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        },
        border && { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.border },
        style,
      ]}
    >
      <Feather name={name} size={size * 0.45} color={color} />
      {badge ? <View style={st.dot} /> : null}
    </PressableScale>
  );
}

/* ───────────────────────── Surfaces ───────────────────────── */
export function Card({ children, style, padded = true, elevated = true }) {
  return (
    <View
      style={[
        st.card,
        padded && { padding: space.md },
        elevated ? shadows.sm : { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Avatar({ uri, size = 44, name, ring, style }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const inner = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: colors.sky100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri ? (
        <Image
          source={uri}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <Text style={{ fontFamily: fonts.bold, color: colors.primary, fontSize: size * 0.36 }}>
          {initials}
        </Text>
      )}
    </View>
  );
  if (!ring) return <View style={style}>{inner}</View>;
  return (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ padding: 2.5, borderRadius: size }, style]}
    >
      <View style={{ padding: 2, borderRadius: size, backgroundColor: colors.card }}>
        {inner}
      </View>
    </LinearGradient>
  );
}

export function Chip({ label, selected, onPress, icon, style }) {
  return (
    <PressableScale
      onPress={onPress}
      hapticKind="select"
      scaleTo={0.94}
      style={[st.chip, selected && st.chipOn, style]}
    >
      {icon ? (
        <Feather name={icon} size={14} color={selected ? "#fff" : colors.textSecondary} />
      ) : null}
      <Text style={[st.chipText, selected && { color: "#fff" }]}>{label}</Text>
    </PressableScale>
  );
}

export function Badge({ label, tone = "primary", style }) {
  const tones = {
    primary: [colors.primarySoft, colors.primary],
    success: [colors.successSoft, colors.success],
    warning: [colors.warningSoft, "#B45309"],
    danger: [colors.dangerSoft, colors.danger],
    violet: [colors.violetSoft, colors.violet],
    dark: ["rgba(11,18,32,0.55)", "#fff"],
    glass: ["rgba(255,255,255,0.22)", "#fff"],
  }[tone];
  return (
    <View style={[st.badge, { backgroundColor: tones[0] }, style]}>
      <Text style={[type.caption, { color: tones[1], fontFamily: fonts.bold }]}>
        {label}
      </Text>
    </View>
  );
}

export function SectionHeader({ title, action, onAction, style }) {
  return (
    <View style={[st.sectionHeader, style]}>
      <Text style={type.h3}>{title}</Text>
      {action ? (
        <PressableScale onPress={onAction} style={st.sectionAction}>
          <Text style={[type.small, { color: colors.primary, fontFamily: fonts.semibold }]}>
            {action}
          </Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </PressableScale>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon = "inbox", title, subtitle, action, onAction, style }) {
  return (
    <View style={[st.empty, style]}>
      <LinearGradient colors={gradients.brandSoft} style={st.emptyIcon}>
        <Feather name={icon} size={30} color={colors.primary} />
      </LinearGradient>
      <Text style={[type.h3, { textAlign: "center" }]}>{title}</Text>
      {subtitle ? (
        <Text style={[type.body, { color: colors.textMuted, textAlign: "center" }]}>
          {subtitle}
        </Text>
      ) : null}
      {action ? (
        <Button title={action} onPress={onAction} size="md" full={false} style={{ marginTop: space.sm }} />
      ) : null}
    </View>
  );
}

/* ───────────────────────── Inputs ───────────────────────── */
export function Input({
  label,
  icon,
  error,
  hint,
  multiline,
  style,
  inputStyle,
  right,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={st.label}>{label}</Text> : null}
      <View
        style={[
          st.inputWrap,
          multiline && { alignItems: "flex-start", minHeight: 120, paddingVertical: 12 },
          focused && st.inputFocused,
          error && { borderColor: colors.danger },
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.textFaint}
            style={multiline ? { marginTop: 2 } : null}
          />
        ) : null}
        <TextInput
          {...props}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          style={[
            { flex: 1, fontSize: 16, paddingVertical: multiline ? 0 : 14 },
            inputStyle,
          ]}
        />
        {right}
      </View>
      {error ? (
        <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[type.caption, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

/* ───────────────────────── List row (settings style) ───────────────────────── */
export function ListRow({
  icon,
  iconColor = colors.primary,
  iconBg = colors.primarySoft,
  title,
  subtitle,
  value,
  onPress,
  right,
  chevron = true,
  destructive,
  last,
  leading,
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.985} hapticKind={onPress ? "select" : null}>
      <View style={[st.row, !last && st.rowDivider]}>
        {leading ? (
          leading
        ) : icon ? (
          <View
            style={[
              st.rowIcon,
              { backgroundColor: destructive ? colors.dangerSoft : iconBg },
            ]}
          >
            <Feather name={icon} size={18} color={destructive ? colors.danger : iconColor} />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            numberOfLines={1}
            style={[type.bodyStrong, destructive && { color: colors.danger }]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={[type.small, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {value ? (
          <Text numberOfLines={1} style={[type.small, { color: colors.textMuted, maxWidth: 140 }]}>
            {value}
          </Text>
        ) : null}
        {right}
        {chevron && onPress ? (
          <Feather name="chevron-right" size={18} color={colors.textFaint} />
        ) : null}
      </View>
    </PressableScale>
  );
}

export function Group({ children, title, style }) {
  return (
    <View style={[{ gap: space.xs }, style]}>
      {title ? <Text style={[type.overline, { color: colors.textMuted, marginLeft: 4 }]}>{title}</Text> : null}
      <View style={[st.card, shadows.xs, { paddingHorizontal: space.md }]}>{children}</View>
    </View>
  );
}

/* ───────────────────────── Skeleton shimmer ───────────────────────── */
export function Skeleton({ width = "100%", height = 16, r = radius.sm, style }) {
  const o = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.5, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={[{ width, height, borderRadius: r, backgroundColor: colors.line, opacity: o }, style]}
    />
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <View style={{ gap: space.sm }}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[st.card, shadows.xs, { padding: space.sm, flexDirection: "row", gap: space.sm }]}>
          <Skeleton width={64} height={64} r={radius.sm} />
          <View style={{ flex: 1, gap: 8, justifyContent: "center" }}>
            <Skeleton width="40%" height={10} />
            <Skeleton width="85%" height={14} />
            <Skeleton width="30%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ───────────────────────── Fade-in on mount ───────────────────────── */
export function FadeIn({ children, delay = 0, style, from = 14 }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 480,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* ───────────────────────── Brand backdrop ───────────────────────── */
export function BrandBackdrop({ style, children, colorsOverride }) {
  return (
    <LinearGradient
      colors={colorsOverride || gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      <View style={[st.orb, { top: -80, right: -60, width: 240, height: 240 }]} />
      <View style={[st.orb, { bottom: -100, left: -80, width: 280, height: 280, opacity: 0.08 }]} />
      {children}
    </LinearGradient>
  );
}

const st = StyleSheet.create({
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: space.lg,
  },
  btnText: { fontFamily: fonts.bold, letterSpacing: 0.1 },
  dot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.card,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
  },
  sectionAction: { flexDirection: "row", alignItems: "center", gap: 4, padding: 4 },
  empty: { alignItems: "center", gap: space.xs, padding: space.xxl },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xs,
  },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginLeft: 2 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#FBFDFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: 14,
  },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#fff",
    opacity: 0.12,
  },
});
