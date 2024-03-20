import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import styles from "../helpers/styles";
import * as FUNCS from "../helpers/funcs";
import { IMG_SIZE } from "../helpers/flow";

const ITEMS_COUNT = 10;

export default function Popular({ navigation }) {
  const [images, setImages] = React.useState([]);
  const ITEMS = [...Array(ITEMS_COUNT)].map((it, i) => ({
    name: `Service ${i}`,
    id: `${i}`,
    pic: "",
  }));

  React.useEffect(() => {
    const fetchImages = async () => {
      const randomImages = await FUNCS.GetRandomImages(
        ITEMS_COUNT,
        IMG_SIZE.w,
        IMG_SIZE.h
      );
      setImages(randomImages);

      console.log("img url: ", randomImages[0].urls.regular);
    };

    fetchImages();
  }, []);

  const onPopularPress = (it) => {
    navigation.navigate("Shop", it);
  };

  return (
    <ScrollView style={[styles.flex1, styles.bgBlue]}>
      <View style={[styles.flex1]}>
        <View>
          <TextInput
            style={[
              styles.paddingMid,
              styles.bgWhite,
              styles.marginMin,
              styles.roundedMd,
              styles.mbLarge,
            ]}
            placeholder="Search popular ..."
          />
        </View>
        <View
          style={[
            styles.mtLarge,
            styles.paddingMid,
            styles.bgWhite,
            styles.borderTopRadiusLarge,
          ]}
        >
          {ITEMS.map((it, i) => (
            <TouchableOpacity
              key={i}
              onPress={(e) =>
                onPopularPress({ ...it, pic: images[i]?.urls?.regular })
              }
            >
              <View style={[styles.flex1, styles.flexRow, styles.mbLarge]}>
                <Image
                  source={{
                    uri: images[i]?.urls?.regular, //"https://m.media-amazon.com/images/M/MV5BMjBlMTRjODMtMDMyYi00OGQ1LWJhNzYtYTYyMTcxOWI5MGM0XkEyXkFqcGdeQW1yb2Njbw@@._V1_QL75_UX500_CR0,0,500,281_.jpg",
                  }}
                  style={{
                    with: 100,
                    height: 60,
                    flex: 1,
                    marginRight: 12,
                    borderRadius: 8,
                  }}
                />
                <View style={{ flex: 2 }}>
                  <Text style={[]}>MAISON SOUDURE</Text>
                  <Text style={[styles.textGreen]}>+12 Services rendus</Text>
                  <Text>5 stars</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
