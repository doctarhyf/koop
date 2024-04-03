import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import SimpleTextButton from "./SimpleTextButton";

const CustomAlert = ({
  visible,
  onClose,
  children,
  showCloseButton = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        > */}
        {children}
        {showCloseButton && (
          <SimpleTextButton text={"OK"} handlePress={onClose} />
        )}
        {/*  </View> */}
      </View>
    </Modal>
  );
};

export default CustomAlert;
