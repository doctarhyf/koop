import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

// Lightweight auto-playing image carousel (replaces
// @coder-shubh/react-native-image-slider, which depended on the
// deprecated react-native-vector-icons package).
export default function ImageSlider({
  images = [],
  imageHeight = 250,
  dotSize = 10,
  dotColor = "white",
  activeDotColor = "black",
  showIndicatorDots = true,
  autoSlideInterval = 5000,
  radius = 0,
  containerStyle,
}) {
  const listRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoSlideInterval || images.length < 2 || width === 0) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % images.length;
        listRef.current?.scrollToOffset({
          offset: next * width,
          animated: true,
        });
        return next;
      });
    }, autoSlideInterval);
    return () => clearInterval(id);
  }, [autoSlideInterval, images.length, width]);

  const onMomentumScrollEnd = (e) => {
    if (width > 0) {
      setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    }
  };

  return (
    <View
      style={[{ height: imageHeight }, containerStyle]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(item, i) => `${i}-${item}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              contentFit="cover"
              transition={300}
              style={{ width, height: imageHeight, borderRadius: radius }}
            />
          )}
        />
      )}

      {showIndicatorDots && images.length > 1 && (
        <View style={st.dots} pointerEvents="none">
          {images.map((_, i) => (
            <View
              key={i}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                marginHorizontal: 4,
                backgroundColor: i === index ? activeDotColor : dotColor,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
});
