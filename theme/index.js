// KOOP design system — single source of truth for color, type, space and depth.
import { Platform } from "react-native";

export const palette = {
  // Brand: sky → electric blue → indigo. Keeps the original KOOP sky as its lightest stop.
  sky: "#7BC6F0",
  sky50: "#EEF8FE",
  sky100: "#D9F0FC",
  blue: "#2F80ED",
  blue600: "#1F6BDB",
  indigo: "#4F46E5",
  violet: "#7C3AED",

  ink: "#0B1220",
  ink2: "#1E293B",
  slate: "#475569",
  muted: "#64748B",
  faint: "#94A3B8",
  line: "#E6EAF2",
  lineSoft: "#EEF1F6",

  canvas: "#F4F6FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFD",

  success: "#10B981",
  successSoft: "#E7F8F1",
  warning: "#F59E0B",
  warningSoft: "#FEF5E6",
  danger: "#EF4444",
  dangerSoft: "#FDECEC",
  violetSoft: "#F1EBFE",
};

export const colors = {
  primary: palette.blue,
  primaryDark: palette.blue600,
  primarySoft: palette.sky50,
  accent: palette.sky,
  text: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.muted,
  textFaint: palette.faint,
  border: palette.line,
  borderSoft: palette.lineSoft,
  bg: palette.canvas,
  card: palette.surface,
  cardAlt: palette.surfaceAlt,
  onPrimary: "#FFFFFF",
  ...palette,
};

export const gradients = {
  brand: ["#7BC6F0", "#2F80ED", "#4F46E5"],
  brandSoft: ["#EEF8FE", "#E8EEFF"],
  aurora: ["#0B1220", "#14213D", "#1F3B8A"],
  premium: ["#7C3AED", "#4F46E5"],
  sunset: ["#F59E0B", "#EF4444"],
  scrim: ["rgba(11,18,32,0)", "rgba(11,18,32,0.85)"],
};

export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};

// Maps a numeric/keyword fontWeight to the matching Jakarta family.
export const fontForWeight = (w) => {
  switch (String(w ?? "400")) {
    case "500":
      return fonts.medium;
    case "600":
      return fonts.semibold;
    case "bold":
    case "700":
      return fonts.bold;
    case "800":
    case "900":
      return fonts.extrabold;
    default:
      return fonts.regular;
  }
};

export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -1 },
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.4 },
  h3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  title: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  overline: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
};

export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 };

export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };

const shadow = (y, blur, opacity, elevation) =>
  Platform.select({
    ios: {
      shadowColor: "#0B1220",
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: { elevation, shadowColor: "#0B1220" },
    default: { boxShadow: `0px ${y}px ${blur * 2}px rgba(11,18,32,${opacity})` },
  });

export const shadows = {
  none: {},
  xs: shadow(1, 2, 0.06, 1),
  sm: shadow(4, 10, 0.06, 2),
  md: shadow(10, 20, 0.08, 6),
  lg: shadow(18, 32, 0.12, 12),
  glow: Platform.select({
    ios: {
      shadowColor: palette.blue,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
    },
    android: { elevation: 8, shadowColor: palette.blue },
    default: { boxShadow: "0px 10px 30px rgba(47,128,237,0.35)" },
  }),
};

// Shared native-stack header look.
export const headerOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  headerBackButtonDisplayMode: "minimal",
  contentStyle: { backgroundColor: colors.bg },
  animation: "slide_from_right",
};

export default { colors, palette, gradients, fonts, type, space, radius, shadows };
