import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { colors, space } from "../theme";
import { Group, ListRow } from "./ui";

const SocialIcon = ({ src }) => (
  <View
    style={{
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.cardAlt,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image source={src} style={{ width: 20, height: 20 }} contentFit="contain" />
  </View>
);

const TabShopInfo = ({ user, handleInfoPress, navigation }) => {
  const shopInfo = {
    shop_name: { value: user.shop_name, icon: "shopping-bag", placeholder: "Nom de la boutique", editable: false, label: "Nom de la boutique" },
    shop_desc: { value: user.shop_desc, icon: "align-left", placeholder: "Description", editable: true, label: "Description" },
    shop_add: { value: user.shop_add, icon: "map-pin", placeholder: "Adresse physique", editable: true, label: "Adresse" },
    shop_tags: { value: user.shop_tags, icon: "tag", placeholder: "Mots-clés", editable: true, label: "Mots-clés" },
    shop_email: { value: user.shop_email, icon: "mail", placeholder: "Email de la boutique", editable: true, label: "Email" },
    shop_web: { value: user.shop_web, icon: "globe", placeholder: "Site web", editable: true, label: "Site web" },
  };

  const socials = {
    shop_whatsapp: { value: user.shop_whatsapp, placeholder: "Ajouter WhatsApp", editable: true, label: "WhatsApp", soc_icon: require("../assets/icons/whatsapp.png") },
    shop_wechat: { value: user.shop_wechat, placeholder: "Ajouter WeChat", editable: true, label: "WeChat", soc_icon: require("../assets/icons/wechat.png") },
    shop_tiktok: { value: user.shop_tiktok, placeholder: "Ajouter TikTok", editable: true, label: "TikTok", soc_icon: require("../assets/icons/tiktok.png") },
    shop_facebook: { value: user.shop_facebook, placeholder: "Ajouter Facebook", editable: true, label: "Facebook", soc_icon: require("../assets/icons/facebook.png") },
  };

  const info = Object.entries(shopInfo);
  const soc = Object.entries(socials);

  return (
    <View style={{ gap: space.lg }}>
      <Group title="Boutique">
        {info.map((data, i) => (
          <ListRow
            key={data[0]}
            icon={data[1].icon}
            title={data[1].value || data[1].placeholder}
            subtitle={data[1].label}
            onPress={data[1].editable ? () => handleInfoPress(data) : undefined}
            last={i === info.length - 1}
          />
        ))}
      </Group>

      <Group title="Réseaux sociaux">
        {soc.map((data, i) => (
          <ListRow
            key={data[0]}
            leading={<SocialIcon src={data[1].soc_icon} />}
            title={data[1].value || data[1].placeholder}
            subtitle={data[1].label}
            onPress={() => handleInfoPress(data)}
            last={i === soc.length - 1}
          />
        ))}
      </Group>

      <Group title="Plus">
        <ListRow
          icon="layers"
          iconColor={colors.violet}
          iconBg={colors.violetSoft}
          title="Mes annonces"
          onPress={() => handleInfoPress(["prods", { editable: false }])}
        />
        <ListRow
          icon="star"
          iconColor="#D97706"
          iconBg={colors.warningSoft}
          title="Changer d'abonnement"
          onPress={() => navigation.navigate("Subscriptions", undefined, { pop: true })}
          last
        />
      </Group>
    </View>
  );
};

export default TabShopInfo;
