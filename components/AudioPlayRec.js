import React, { useState, useEffect } from "react";
import styles from "../helpers/styles";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/FontAwesome";
import { KOOP_BLUE, KOOP_GREEN } from "../helpers/colors";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { GetMMSS } from "../helpers/funcs";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RecordingIndicator = () => {
  return (
    <View style={[styles.flexRow, styles.justifyCenter, styles.alignCenter]}>
      <Octicons name="dot-fill" size={32} color="red" />
      <View style={[{ width: 10 }]}></View>
      <Text>Recording</Text>
    </View>
  );
};

const TrackPlayer = () => {
  const [playing, setplaying] = useState(false);
  const [duration, setduration] = useState(0);

  useEffect(() => {
    let id;
    if (playing) {
      let dur = duration;
      id = setInterval(() => {
        dur++;
        setduration(dur);
        console.log("int => ", GetMMSS(dur));
      }, 1000);
    }

    return () => clearInterval(id);
  }, [playing]);

  return (
    <View
      style={[
        styles.flexRow,
        styles.justifyBetween,
        styles.alignCenter,
        styles.marginV,
        st.trackcont,
        styles.paddingSmall,
      ]}
    >
      {playing && (
        <TouchableOpacity onPress={(e) => setplaying(false)}>
          <AntDesign name="pause" size={24} color="black" />
        </TouchableOpacity>
      )}

      {!playing && (
        <TouchableOpacity onPress={(e) => setplaying(true)}>
          <AntDesign name="play" size={24} color="black" />
        </TouchableOpacity>
      )}
      <View style={[{ width: 10 }]} />
      <View style={[st.track]}>
        <Octicons
          style={[st.dot]}
          name="dot-fill"
          size={32}
          color={KOOP_GREEN}
        />
      </View>
      <View style={[{ width: 10 }]} />
      <Text>{GetMMSS(duration)}</Text>
    </View>
  );
};

const TrackRecorder = ({ recording, duration }) => {
  const [showRecIndic, setshowRecIndic] = useState(false);

  useEffect(() => {
    setshowRecIndic(true);
    let id;

    if (recording) {
      setTimeout(() => {
        setshowRecIndic(false);
      }, 1800);
    }

    return () => clearTimeout(id);
  }, [recording]);

  return showRecIndic ? (
    <RecordingIndicator />
  ) : (
    <View
      style={[
        styles.flexRow,
        styles.justifyBetween,
        styles.alignCenter,
        styles.marginV,
        st.trackcont,
        styles.paddingSmall,
        { backgroundColor: "#ff000033" },
      ]}
    >
      <Text>{GetMMSS(duration)}</Text>

      <View style={[{ width: 10 }]} />
      <View style={[st.track]}>
        <Octicons
          style={[st.dot]}
          name="dot-fill"
          size={32}
          color={KOOP_GREEN}
        />
      </View>
    </View>
  );
};

export default function AudioPlayRec({}) {
  const [playing, setplaying] = useState(false);
  const [recording, setrecording] = useState(false);
  const [duration, setduration] = useState(0);

  //const [re]

  useEffect(() => {
    let id;
    if (recording) {
      let dur = duration;
      id = setInterval(() => {
        dur++;
        setduration(dur);
        console.log("int => ", GetMMSS(dur));
      }, 1000);
    }

    return () => clearInterval(id);
  }, [recording]);

  const handlePress = (e) => {
    setrecording((old) => !old);

    let toast = Toast.show("Recording ...", {
      duration: Toast.durations.LONG,
    });

    // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    setTimeout(function hideToast() {
      Toast.hide(toast);
    }, 2800);
  };

  const onPlay = (e) => {
    setplaying((old) => setplaying(!old));
  };

  const onDelete = (e) => {};

  const onPause = (e) => {
    setrecording((old) => setrecording(!old));
  };

  const onStopRecording = (e) => {
    setrecording((old) => setrecording(!old));
  };

  const onSaveAudio = (e) => {};

  return (
    <View style={[styles.marginH, styles.marginVLarge]}>
      {!recording && <TrackPlayer />}
      {recording && <TrackRecorder recording={recording} duration={duration} />}

      <View style={[styles.flexRow, styles.justifyBetween, styles.alignCenter]}>
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>

        {!recording && (
          <TouchableOpacity
            onPress={(e) => setrecording((old) => setrecording(!recording))}
          >
            <Icon name="microphone" size={26} color="red" />
          </TouchableOpacity>
        )}

        {recording && (
          <TouchableOpacity onPress={onStopRecording}>
            <Icon name="stop-circle" size={26} color="red" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onSaveAudio}>
          <MaterialCommunityIcons
            name="send-circle"
            size={32}
            color={KOOP_GREEN}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const st = StyleSheet.create({
  track: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    height: 10,
    marginBottom: 10,
    flexGrow: 1,
  },
  dot: {
    position: "absolute",
    marginTop: -6,
    marginLeft: "80%",
  },
  hs: {
    width: 10,
  },
  trackcont: {
    backgroundColor: "#66666622",
    padding: 6,
    borderRadius: 24,
  },
});
