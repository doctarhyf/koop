import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { KOOP_BLUE } from "../helpers/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { deleteOldProfile, getPublicUrl, uploadPic } from "../utils/db";

import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { KOOP_BUCKET_NAME, supabase } from "../utils/supabase";
import UserContext from "../context/UserContext";

const MEDIA_TYPE_CAMERA = 0;

export default function ProfileUploader({
  currentURI,
  onProfilePicUri,
  setUpdatingProfile,
  color = KOOP_BLUE,
}) {
  const { user, setuser } = useContext(UserContext);
  const { phone } = user;
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleAddImage = (e) => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const onChooseMedia = (mediaType) => {
    pickImageAsync(mediaType);
  };

  const pickImageAsync = async (mediaType) => {
    setUpdatingProfile(true);
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

      const res = await deleteOldProfile(currentURI);

      console.error("del cur uri => ", res);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const filePath = `user_${phone}/profile_${new Date().getTime()}.jpg`;
      const contentType = "image/jpg";

      const { data, error } = await supabase.storage
        .from("koop")
        .upload(filePath, decode(base64), { contentType });

      console.log("Profile pic uploaded! data => ", data);
      if (data !== null && data.fullPath) {
        const publicURL = await getPublicUrl(
          data.fullPath.replace("koop/", "")
        );

        onProfilePicUri(publicURL);
        setUpdatingProfile(false);
      }
    }

    setUpdatingProfile(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handleAddImage}>
        <Entypo name="camera" size={24} color={color} />
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
                handleOnPress={(e) => onChooseMedia(i)}
              />
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const st = StyleSheet.create({
  error: {
    backgroundColor: "red",
    color: "white",
    fontSize: 11,
    padding: 8,
    margin: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 32,
  },
  profile: {
    backgroundColor: "#ddd",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  ti: {
    borderBottomWidth: 1,
    width: "80%",
  },
  selfStart: {
    alignSelf: "flex-start",
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
