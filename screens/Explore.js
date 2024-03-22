import React, { useEffect, useState } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import * as FUNCS from "../helpers/funcs";
import { DIAPO_PICS, BIG_FONT_SIZE, IMG_SIZE } from "../helpers/flow";

const Explore = () => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const randomImages = await FUNCS.GetRandomImages(
        17,
        IMG_SIZE.w,
        IMG_SIZE.h
      );
      // console.log("rd img => ", randomImages[0]);
      setdata(
        randomImages.map((img, i) => ({ id: i, image: img.urls.regular }))
      );
    };

    fetchImages();
  }, []);

  const renderItem = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Adjust the number of columns as needed
      />
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const imageWidth = (screenWidth - 16) / 2; // 16 is the total horizontal margin space

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  image: {
    width: imageWidth,
    height: imageWidth * 1.5, //imageWidth * 1.5, // Adjust the aspect ratio as needed
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default Explore;
