import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import TextButton from "../components/TextButton";
import styles from "../helpers/styles";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  height,
  width,
} from "deprecated-react-native-prop-types/DeprecatedImagePropType";

const ImageViewer = (img) => {
  const ph = require("../assets/images/gps.jpg");
  return (
    <View>
      <Image source={img ? { uri: img } : ph} />
    </View>
  );
};

export default function Test() {
  const [image, setimage] = useState("");

  const loadGalleryImage = async (e) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setimage(uri);
    } else {
      alert("You did not select any image or video.");
    }
  };

  const loadCameraImage = async (e) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setimage(uri);
    } else {
      alert("You did not select any image or video.");
    }
  };

  return (
    <View style={[styles.paddingMid, styles.flex1]}>
      <TextButton
        handlePress={loadGalleryImage}
        label={"Load Gallery Image"}
        iconName="camera"
      />
      <TextButton
        handlePress={loadCameraImage}
        label={"Load Image"}
        iconName="camera"
      />
      {/* <ImageViewer img={image} /> */}

      <View style={{ width: "100%", height: 200, backgroundColor: "red" }}>
        <Image
          source={{ uri: image }}
          style={[{ width: 200, height: 200, backgroundColor: "red" }]}
        />
      </View>
      <Text>Img url : {image}</Text>
    </View>
  );
}
