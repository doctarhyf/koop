import { TouchableOpacity, View, Text } from "react-native";
import styles from "../helpers/styles";
import { Image } from "expo-image";
export default MenuButton = ({ handleOnPress, btn, textSmall }) => {
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
        ]}
      >
        <Image style={styles.btnIcon} source={btn.icon} transition={1000} />
        <Text style={styles.textBlueDark}>{btn.label}</Text>
      </View>
    </TouchableOpacity>
  );
};
