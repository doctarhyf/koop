import { TouchableOpacity, View, Text } from "react-native";
import styles from "../helpers/styles";
import { Image } from "expo-image";
export default MenuButton = ({ handleOnPress, btn, textSmall, icon }) => {
  /* example
  btn = {
    id:0,
    label:'Button label',
    icon:require('../assets/icon.png')
  } */
  return (
    <TouchableOpacity
      style={styles.mtLarge}
      onPress={(e) => handleOnPress(btn)}
    >
      <View
        style={[
          styles.btnCont,
          styles.paddingSmall,
          styles.roundedMd,
          styles.borderBlue,
          { gap: 8 },
        ]}
      >
        {icon ? (
          <View style={{ marginRight: 8 }}>{icon}</View>
        ) : (
          <Image style={[styles.btnIcon]} source={btn.icon} transition={1000} />
        )}
        <Text style={styles.textBlueDark}>{btn.label}</Text>
      </View>
    </TouchableOpacity>
  );
};
