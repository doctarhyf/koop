import { useState, useRef } from "react";
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
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../helpers/styles";
import MenuButton from "../components/MenuButton";
import { BUTTONS } from "../helpers/flow";
import { KOOP_BLUE, KOOP_BLUE_DARK, KOOP_BLUE_LIGHT } from "../helpers/colors";
import AudioPlayRec from "../components/AudioPlayRec";
import { uploadImage } from "../utils/db";

const MEDIA_ITEMS = [
  { label: "Add Video", icon: require("../assets/icons/video.png") },
  { label: "Add Photo 1", icon: require("../assets/icons/photo.png") },
  { label: "Add Photo 2", icon: require("../assets/icons/photo.png") },
];

const MEDIA_TYPE_CAMERA = 0;

export default function Provide({ navigation }) {
  const [agreed, setAgree] = useState(false);
  const [servdata, setservdata] = useState({ type: "", desc: "", files: [] });
  const [loading, setloading] = useState(true);
  const bottomSheetRef = useRef(null);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

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

    console.error("postdata => ", servdata);
  };

  const handleChange = (type, text) => {
    setservdata((old) => ({ ...old, [type]: text }));
  };

  const handleAddMedia = (e) => {
    console.log(e);
    openBottomSheet();
    //pickImageAsync();
  };

  const onChooseMedia = (mediaType) => {
    pickImageAsync(mediaType.id);
  };

  const pickImageAsync = async (mediaType) => {
    closeBottomSheet();
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

    if (!result.canceled) {
      const fileurl = result.assets[0];
      uploadImage(
        fileurl,
        (s) => {
          Alert.alert(
            "Upload success",
            "The media has been uploadaded successfully"
          );
        },
        (e) => {
          Alert.alert("Error", "error upload" + JSON.stringify(e));
        }
      );
    } else {
      alert("You did not select any image or video.");
    }
  };

  return (
    <View style={[styles.flex1, styles.bgBlue]}>
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
            value={servdata.type}
            onChangeText={(text) => handleChange("type", text)}
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
            ]}
            placeholder="A short description about your service"
            value={servdata.type}
            onChangeText={(text) => handleChange("desc", text)}
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
            <ScrollView horizontal>
              {MEDIA_ITEMS.map((it, i) => (
                <TouchableOpacity key={i} onPress={handleAddMedia}>
                  <View
                    style={[
                      styles.bgBlue,
                      styles.roundedSmall,
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
                        { width: 30, height: 30, resizeMode: "contain" },
                      ]}
                      source={it.icon}
                    />
                    <Text style={[styles.textWhite, styles.textCenter]}>
                      {it.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
          <ActivityIndicator
            animating={false}
            style={[styles.marginBottomLarge]}
          />
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={bottomSheetVisible}
        onRequestClose={closeBottomSheet}
      >
        <View style={bs.modalContainer}>
          <View style={bs.bottomSheet}>
            <Text>Choose media source</Text>
            {[
              {
                label: "Camera",
                icon: require("../assets/icons/camera.png"),
              },
              {
                label: "Gallery",
                icon: require("../assets/icons/gallery.png"),
              },
            ].map((btn, i) => (
              <MenuButton
                key={i}
                btn={{ ...btn, id: i }}
                handleOnPress={onChooseMedia}
              />
            ))}
          </View>
        </View>
      </Modal>
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

const bs = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 16,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
  },
});
