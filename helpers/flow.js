import ServiceRequest from "../screens/ServiceRequest";

export const DIAPO_PICS = [
  require("../assets/diapo/p1.png"),
  require("../assets/diapo/p2.png"),
  require("../assets/diapo/p3.png"),
  require("../assets/diapo/p4.png"),
  require("../assets/diapo/p5.png"),
  require("../assets/diapo/p6.png"),
];

export const IMG_SIZE = { w: 180, h: 180 - 60 };

export const BIG_FONT_SIZE = 18;

export const MAIN_MENU_BUTTONS = [
  /*  {
    label: "PROVIDE A SERVICE",
    route: "Provide",
    icon: require("../assets/icons/provide.png"),
  }, */
  {
    label: "LANCER UNE DEMANDE DE SERVICE",
    route: ServiceRequest.ROUTE,
    icon: require("../assets/icons/provide.png"),
  },
  {
    label: "LOOK FOR A SERVICE",
    route: "Look",
    icon: require("../assets/icons/megaphone.png"),
  },
  {
    label: "OTHER SERVICES",
    route: "Other",
    icon: require("../assets/icons/other.png"),
  },
];
