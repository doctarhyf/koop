import { StyleSheet } from "react-native";
import { GREEN, KOOP_BLUE, KOOP_BLUE_DARK, KOOP_BLUE_LIGHT } from "./colors";
import { BIG_FONT_SIZE } from "./flow";

const styles = StyleSheet.create({
  bgBlue: { backgroundColor: KOOP_BLUE },
  bgBlueLight: { backgroundColor: KOOP_BLUE_LIGHT },
  borderBlue: { borderColor: KOOP_BLUE },
  bgWhite: { backgroundColor: "white" },
  bgBlack: { backgroundColor: "black" },
  flex1: {
    flex: 1,
  },
  txtInput: {
    padding: 12,
    margin: 8,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 12,
  },
  ti: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    textAlignVertical: "top",
  },
  flexCol: {
    flexDirection: "column",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  fontBold: {
    fontWeight: "bold",
  },
  textWhite: {
    color: "white",
  },
  textGreen: {
    color: GREEN,
  },
  textBGBlackTransp: {
    backgroundColor: "#00000088",
  },
  textLarge: {
    fontSize: BIG_FONT_SIZE,
  },
  textSmall: {
    fontSize: 14,
  },
  textXXL: {
    fontSize: 36,
  },
  textXL: {
    fontSize: 30,
  },
  textLarge: {
    fontSize: 24,
  },
  textBlue: {
    color: KOOP_BLUE,
  },
  textBlueDark: {
    color: KOOP_BLUE_DARK,
  },
  btnBorder: {
    borderColor: KOOP_BLUE,
    borderWidth: 1,
  },
  btnBorderWhite: {
    borderColor: "white",
    borderWidth: 1,
  },
  bgWhite: {
    backgroundColor: "white",
  },
  mtLarge: {
    marginTop: 18,
  },
  roundedSmall: {
    borderRadius: 4,
  },
  textAlignVerticalTop: {
    textAlignVertical: "top", // Align text to the top
    // Align the TextInput to the left
  },
  alignSelfStart: {
    alignSelf: "flex-start",
  },

  mtSmall: {
    marginTop: 12,
  },
  mbLarge: {
    marginBottom: 18,
  },
  borderTopStartRadius: {
    borderTopStartRadius: 36,
  },
  paddingLarge: {
    padding: 36,
  },
  marginTopLarge: {
    marginTop: 36,
  },
  marginTopSmall: {
    marginTop: 12,
  },
  marginBottomXXL: {
    marginBottom: 46,
  },
  marginBottomLarge: {
    marginBottom: 36,
  },
  marginLeftLarge: {
    marginLeft: 36,
  },
  marginRightLarge: {
    marginRight: 36,
  },
  marginRight: {
    marginRight: 24,
  },
  marginHLarg: {
    marginHorizontal: 36,
  },
  marginH: {
    marginHorizontal: 12,
  },
  marginV: {
    marginVertical: 12,
  },
  marginVLarge: {
    marginVertical: 36,
  },
  marginLarge: {
    margin: 36,
  },
  marginVMin: {
    marginVertical: 8,
  },
  marginMin: {
    margin: 8,
  },
  paddingMid: {
    padding: 18,
  },
  paddingSmall: {
    padding: 12,
  },
  roundedMd: {
    borderRadius: 18,
  },
  overflowHidden: {
    overflow: "hidden",
  },
  textGray: {
    color: "gray",
  },
  textCenter: {
    textAlign: "center",
  },
  borderTopRadiusLarge: {
    borderTopStartRadius: 36,
    borderTopEndRadius: 36,
  },
  btnIcon: {
    width: 30,
    height: 30,
    marginRight: 18,
  },
  btnCont: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightGrey",
  },
  borderGray: {
    borderColor: "lightgray",
  },
  borderMid: {
    borderWidth: 1,
  },
  imgDiapo: {
    backgroundColor: KOOP_BLUE,
    width: 200,
    height: 120,

    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  alignCenter: {
    alignItems: "center",
  },
});

export default styles;
