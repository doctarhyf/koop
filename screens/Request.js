import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { BUTTONS } from "../helpers/flow";
import { KOOP_BLUE, KOOP_BLUE_DARK, KOOP_BLUE_LIGHT } from "../helpers/colors";
import AudioPlayRec from "../components/AudioPlayRec";
import ImageAdder from "../components/ImageAdder";

export default function Request({ navigation }) {
  const MEDIA_ITEMS = [
    { label: "Add Video", icon: require("../assets/icons/video.png") },
    { label: "Add Photo 1", icon: require("../assets/icons/photo.png") },
    { label: "Add Photo 2", icon: require("../assets/icons/photo.png") },
  ];

  const [agreed, setAgree] = React.useState(false);

  const toggleSwitch = (e) => {
    setAgree((prev) => !prev);
  };
  const onPost = (e) => {
    console.log(e);
    if (!agreed) {
      Alert.alert(
        "Agree to terms and conds first!",
        "You need to agree to terms and conditions before posting!"
      );
      return;
    }
  };

  const handleAddMedia = (e) => {
    console.log(e);
    pickImageAsync();
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert("You did not select any image or video.");
    }
  };

  const onImageAdded = (images) => {
    console.log("new images :=> ", images);
  };

  return (
    <View style={[styles.flex1, styles.bgBlue]}>
      <Text
        style={[
          styles.textCenter,
          styles.textWhite,
          { paddingHorizontal: 12 },
          styles.marginVMin,
        ]}
      >
        Pour lancer une offre de service, soyez claire et precis par rapport a
        ce que vous offrez comme services ou produits, la meilleure qualite de
        vos photos a un impact sur votre clientele
      </Text>

      <View
        style={[
          styles.mtLarge,
          styles.flex1,
          styles.bgWhite,
          styles.borderTopRadiusLarge,
        ]}
      >
        <ScrollView>
          <Text
            style={[
              styles.marginTopLarge,
              styles.marginHLarg,
              styles.fontBold,
              styles.textBlue,
            ]}
          >
            SERVICE TYPE
          </Text>
          <TextInput
            style={[
              styles.marginHLarg,
              styles.borderGray,
              styles.borderMid,
              styles.paddingSmall,
              styles.mtLarge,
              styles.roundedSmall,
            ]}
            placeholder="Service type ..."
          />
          <Text style={[styles.textGray, styles.marginHLarg, styles.mtLarge]}>
            Please describe the service you want to provide
          </Text>
          <Text
            style={[
              styles.marginHLarg,
              styles.fontBold,
              styles.mtLarge,
              styles.textBlue,
            ]}
          >
            SERVICE DESCRIPTION
          </Text>
          <TextInput
            style={[
              styles.marginHLarg,
              styles.borderGray,
              styles.borderMid,
              styles.paddingSmall,
              styles.mtLarge,
              styles.roundedSmall,
              { textAlignVertical: "top" },
            ]}
            multiline={true}
            numberOfLines={5}
            placeholder="A short description about your service"
          />
          <Text
            style={[
              styles.marginHLarg,
              styles.fontBold,
              styles.mtLarge,
              styles.textBlue,
            ]}
          >
            AUDIO DESCRIPTION
          </Text>
          <AudioPlayRec />
          <Text
            style={[
              styles.marginHLarg,
              styles.fontBold,
              styles.mtLarge,
              styles.textBlue,
            ]}
          >
            VIDEO/PHOTO
          </Text>

          <View style={[styles.marginVLarge]}>
            {/* <ScrollView horizontal>
              {MEDIA_ITEMS.map((it, i) => (
                <TouchableOpacity key={i} onPress={handleAddMedia}>
                  <View
                    style={[
                      styles.bgBlue,
                      styles.roundedMd,
                      styles.overflowHidden,
                      styles.marginH,
                      styles.flex1,
                      styles.imgDiapo,
                      styles.justifyCenter,
                    ]}
                  >
                    <Image
                      style={[
                        styles.imgDiapo,
                        { height: 30, resizeMode: "contain" },
                      ]}
                      source={it.icon}
                    />
                    <Text style={[styles.textWhite, styles.textCenter]}>
                      {it.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView> */}
            <ImageAdder onImageAdded={onImageAdded} />
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyCenter: "center",
              alignItems: "center",
            }}
          >
            <Text>Agree to terms and conditons</Text>
            <Switch
              trackColor={{ false: "#ddd", true: KOOP_BLUE_LIGHT }}
              thumbColor={agreed ? KOOP_BLUE : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={agreed}
            />
          </View>
          <View style={[styles.marginHLarg, styles.marginBottomLarge]}>
            <MenuButton
              btn={{
                label: "POST SERVICE",
                route: "Provide",
                icon: require("../assets/icons/post.png"),
              }}
              handleOnPress={onPost}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  imgDiapoInsideIcon: {
    width: 30,
    height: 30,
  },
  mediaItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
