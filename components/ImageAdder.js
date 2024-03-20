import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { KOOP_BLUE_DARK, KOOP_BLUE_LIGHT } from "../helpers/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

const IMG_SIZE = 260;
const MEDIA_TYPE_CAMERA = 0;

export default function ImageAdder({
  onImageAdded,
  onImagePressed,
  navigation,
}) {
  const [images, setimages] = useState([]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleAddImage = (e) => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
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
      const { uri } = result.assets[0];
      let newimages = [...images, uri];
      setimages(newimages);
      onImageAdded(newimages);
    } else {
      alert("You did not select any image or video.");
    }
  };

  const handleLongPress = (idx, img) => {
    Alert.alert(
      "Delete picture?" + idx,
      "Do you wanna remove this picture?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setimages((old) => old.filter((it, i) => i !== idx));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView horizontal style={[{ backgroundColor: "#99999933" }]}>
      {images.map((img, i) => (
        <TouchableOpacity
          key={i}
          onLongPress={(e) => handleLongPress(i, img)}
          onPress={(e) => onImagePressed(img)}
        >
          <View style={[st.imgcont]}>
            <Image source={{ uri: img }} style={[st.img]} />
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleAddImage}>
        <View style={[st.imgcont, st.addimg]}>
          <Icon name={"camera"} size={24} style={{ color: KOOP_BLUE_DARK }} />
          <Text>Ajouter Image</Text>
        </View>
      </TouchableOpacity>

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
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  imgbg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wbg: {
    flex: 3,
    width: "100%",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  ti: {
    borderBottomColor: "#66666666",
    borderBottomWidth: 1,
  },
  tav: {
    textAlignVertical: "top",
  },
  sw: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cont: {
    padding: 12,
  },
  label: {
    color: "#666666dd",
    fontSize: 14,
  },

  imgcont: {
    backgroundColor: KOOP_BLUE_LIGHT,
    height: IMG_SIZE,
    width: IMG_SIZE,
    marginRight: "10",
  },
  img: {
    height: "100%",
    resizeMode: "cover",
    marginLeft: 5,
    marginRight: 5,
  },
  addimg: {
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
