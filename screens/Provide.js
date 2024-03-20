import React, {
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ActivityIndicator,
  Modal,
  Switch,
  Alert,
  ImageBackground,
} from "react-native";
import * as FUNCS from "../helpers/funcs";

import {
  KOOP_BLUE,
  KOOP_BLUE_DARK,
  KOOP_BLUE_LIGHT,
  KOOP_BLUE_TRANSLUCIDE,
} from "../helpers/colors";
import TextButton from "../components/TextButton";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import ImageAdder from "../components/ImageAdder";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";
import MenuButton from "../components/MenuButton";
import styles from "../helpers/styles";
import { AntDesign } from "@expo/vector-icons";
import * as SB from "../utils/db";
import { TABLE_NAMES, supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";
import { UserContext } from "../App";
import { RadioButton } from "../components/RadioButton";
import { Permissions } from "expo";
import * as FileSystem from "expo-file-system";

const IMG_SIZE = 260;
const MEDIA_TYPE_CAMERA = 0;

export default function Provide({ navigation, route }) {
  const { user, setuser } = useContext(UserContext);
  const [loadedImages, setLoadedImages] = useState([]);
  const [images, setimages] = useState([]);
  const [loading, setloading] = useState(false);
  const bottomSheetRef = useRef(null);
  const upd = route.params;
  const updating = upd !== undefined;

  //alert(JSON.stringify(upd));

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const [servdata, setservdata] = useState({});
  const [agreed, setagreed] = useState(false);

  const toggleSwitch = (type, val) => {
    const upd = { ...servdata };
    upd[type] = val;
    setservdata(upd);
  };

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator animating={loading} />
        ) : agreed ? (
          servdata.name && servdata.photos && servdata.photos.length >= 1 ? (
            <TextButton
              iconName="paper-plane"
              label={"POST"}
              handlePress={saveItem}
            />
          ) : (
            <Text></Text>
          )
        ) : (
          <Text></Text>
        ),
    });
  }, [navigation, servdata, loading, agreed]);

  useEffect(() => {
    const fetchImages = async () => {
      let randomImages = await FUNCS.GetRandomImages(10, IMG_SIZE, IMG_SIZE);

      const urls = randomImages.map((img, i) => img.urls.regular);
      setLoadedImages(urls);

      console.log("img url: ", urls[0]);
    };

    fetchImages();

    if (updating) {
      setagreed(true);
      alert(JSON.stringify(upd));
      //setimages(upd.photos);
      setservdata({ ...upd });
    }
  }, []);

  const saveItem = async (e) => {
    if (!agreed) return;
    setloading(true);

    // Alert.alert('Posting item', 'Wait a second ...', [], {cancelable:false})
    const promises = [];

    console.log("images => ", servdata.photos);
    // Upload the same image 4 times for demonstration purposes
    for (let i = 0; i < servdata.photos.length; i++) {
      console.error(images[i]);
      const imagePath = `user_${
        user.phone
      }/item_${i}_${new Date().getTime()}.jpg`;
      const fileData = await FileSystem.readAsStringAsync(servdata.photos[i], {
        encoding: FileSystem.EncodingType.Base64,
      });

      promises.push(
        supabase.storage.from("koop").upload(imagePath, decode(fileData), {
          cacheControl: "3600",
          contentType: "image/jpeg",
        })
      );
    }

    // Wait for all uploads to complete
    const results = await Promise.all(promises);
    console.log("All pictures uploaded successfully:", results);

    if (results) {
      const photos = [];
      results.forEach(async (it, i) => {
        //photos.push(it.data.fullPath);
        const fullPath = it.data.fullPath;
        const purl = await SB.getPublicUrl(fullPath.replace("koop/", ""));
        photos.push(purl);

        console.error("photos => ", photos);
        console.error("photos len => ", photos.length);

        if (photos.length === results.length) {
          const res = await SB.insertItem(TABLE_NAMES.KOOP_ITEMS, {
            ...servdata,
            photos: photos,
            user_id: user.id,
          });

          setloading(false);
          console.error("res => ", res);
          Alert.alert("Item posted", "Your item has been posted!", [
            {
              text: "MY SERVICES",
              onPress: () => {
                navigation.replace("MyServices");
              },
            },
          ]);
        }
      });

      return;

      console.error("upload item res => ", res);
    }
  };

  const handleAddMedia = (e) => {
    const rndidx = Math.floor(Math.random() * (loadedImages.length - 5));
    const rndurl = loadedImages[rndidx];
    setimages((old) => [...old, rndurl]);
    // openBottomSheet();
  };

  const onChooseMedia = (mediaType) => {
    pickImageAsync(mediaType.id);
  };

  const pickImageAsync = async (mediaType) => {
    closeBottomSheet();

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      // Permission granted, you can access camera now
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
        setimages((old) => [...old, fileurl]);
      } else {
        alert("You did not select any image or video.");
      }
    } else {
      // Permission denied
      alert("Koop needs access to your camera and camera roll");
    }
  };

  const onImageAdded = (e) => {
    setservdata((old) => ({ ...old, photos: e }));
  };

  const onImagePressed = (img) => {
    navigation.navigate("PhotoViewer", img);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const itemType = [
    { label: "Service", value: "serv" },
    { label: "Product", value: "prod" },
  ];

  const handleSelectItemType = (value) => {
    setSelectedOption(value);
    setservdata((old) => ({ ...old, category: value }));
  };

  return agreed ? (
    <ScrollView>
      <View>
        <ImageAdder
          onImageAdded={onImageAdded}
          onImagePressed={onImagePressed}
        />
        {!(servdata.photos && servdata.photos.length >= 0) && (
          <View
            style={[styles.justifyCenter, styles.alignCenter, styles.flexRow]}
          >
            <AntDesign name="camera" size={24} color="red" />
            <Text
              style={[
                styles.paddingMid,
                styles.textCenter,
                styles.marginMin,
                { color: "red" },
              ]}
            >
              You must add atleast one picture
            </Text>
          </View>
        )}
        <View style={[st.cont]}>
          <View
            style={{
              flex: 1,

              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <RadioButton
              options={itemType}
              selectedOption={selectedOption}
              onSelect={handleSelectItemType}
            />
          </View>
          <Text style={[st.label]}>Nom de l'article</Text>
          <TextInput
            style={[st.ti]}
            value={servdata.name}
            onChangeText={(text) =>
              setservdata((old) => ({ ...old, name: text }))
            }
          />
          <Text style={[st.label]}>Description (facultatif)</Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={[st.ti, st.tav]}
            value={servdata.desc}
            onChangeText={(text) =>
              setservdata((old) => ({ ...old, desc: text }))
            }
          />

          {showMore && (
            <>
              <Text style={[st.label]}>lien</Text>
              <TextInput
                style={[st.ti]}
                value={servdata.link}
                onChangeText={(text) =>
                  setservdata((old) => ({ ...old, link: text }))
                }
              />
              <Text style={[st.label]}>code</Text>
              <TextInput
                style={[st.ti]}
                value={servdata.code}
                onChangeText={(text) =>
                  setservdata((old) => ({ ...old, code: text }))
                }
              />
            </>
          )}

          {!showMore && (
            <TextButton
              style={[{ paddingVertical: 10 }]}
              label={"SHOW MORE FIELDS"}
              handlePress={(e) => setShowMore(true)}
            />
          )}

          <View style={[st.sw]}>
            <Text style={[st.label, { justifyContent: "center" }]}>Actif</Text>
            <Switch
              thumbColor={servdata.active ? KOOP_BLUE : "#f4f3f4"}
              trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
              ios_backgroundColor={KOOP_BLUE_TRANSLUCIDE}
              onValueChange={(e) => toggleSwitch("active", e)}
              value={servdata.active}
            />
          </View>

          <Text style={[st.label, styles.marginBottomLarge]}>
            Lorsque l'article n'est pas actif votre article ne sera pas visible{" "}
          </Text>
          <View style={[st.sw]}>
            <Text style={[st.label, { justifyContent: "center" }]}>
              Long post
            </Text>
            <Switch
              thumbColor={servdata.long ? KOOP_BLUE : "#f4f3f4"}
              trackColor={{ false: "#767577", true: KOOP_BLUE_DARK }}
              ios_backgroundColor={KOOP_BLUE_TRANSLUCIDE}
              onValueChange={(e) => toggleSwitch("long", e)}
              value={servdata.long}
            />
          </View>
          <Text style={[st.label, styles.marginBottomLarge]}>
            If subcription is not free your post will last more than 24hours
          </Text>
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
    </ScrollView>
  ) : (
    <ImageBackground
      source={require("../assets/images/splash.jpg")}
      resizeMode="cover"
      style={[st.imgbg]}
    >
      <View style={[{ flex: 1 }]}></View>
      <LinearGradient
        style={[st.wbg]}
        locations={[0.1, 0.4]}
        colors={["#00000000", "#ffffffee"]}
      >
        <Text style={[{ fontSize: 48, fontWeight: "bold" }]}>KOOP</Text>
        <Text
          style={[{ fontSize: 16, marginHorizontal: 18, marginVertical: 12 }]}
        >
          Un moyen simple, securise et fiable pour votre entreprise de
          communiquer avec la clientelle
        </Text>
        <Text
          style={[
            {
              marginTop: 24,
              marginHorizontal: 22,
              color: "#66666699",
              textAlign: "center",
            },
          ]}
        >
          Auppuyez sur 'Accepter et continuer' pour accepter les{" "}
        </Text>
        <TouchableOpacity onPress={(e) => navigation.navigate("TOS")}>
          <Text style={[{ color: KOOP_BLUE }]}>
            Conditions d'utilisations de KOOP.
          </Text>
        </TouchableOpacity>
        <TextButton
          customStyles={[{ padding: 10, margin: 12 }]}
          style={[{ padding: 10, margin: 12 }]}
          iconName="check"
          label={"AGREE"}
          handlePress={(e) => setagreed(true)}
        />
      </LinearGradient>
    </ImageBackground>
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
