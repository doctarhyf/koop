import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import * as FUNCS from "../helpers/funcs";
import { DIAPO_PICS, BIG_FONT_SIZE, IMG_SIZE } from "../helpers/flow";
import { Image } from "expo-image";
import { colors, radius } from "../theme";

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

  const renderItem = ({ item, index }) => (
    <Image
      source={item.image}
      contentFit="cover"
      transition={400}
      style={[styles.image, { height: index % 3 === 0 ? imageWidth * 1.5 : imageWidth * 1.2 }]}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: GAP }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const GAP = 10;
const imageWidth = (screenWidth - GAP * 3) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  image: {
    width: imageWidth,
    borderRadius: radius.lg,
    backgroundColor: colors.sky100,
  },
});

export default Explore;
