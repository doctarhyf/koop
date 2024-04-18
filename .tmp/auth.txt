import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function Test() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricAvailable(compatible);

    alert(`Biometric compatible ${compatible}`);
  };

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID",
      // disableDeviceFallback: true, // Only allow Face ID, not fallback to passcode
      fallbackLabel: "Enter Passcode cool", // Custom fallback label
    });
    if (result.success) {
      alert("Authentication successful!");
    } else {
      alert("Authentication failed!");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Biometric Authentication Example</Text>
      <Button
        title="Check Biometric Availability"
        onPress={checkBiometricAvailability}
      />
      {isBiometricAvailable && (
        <Button title="Authenticate with Biometrics" onPress={authenticate} />
      )}

      {/* <View>
      <Text>Cool</Text>

      
      <View>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <View>
        <Button title="Sign Up" color="#000" onPress={handleSignUp} />
      </View> 
    </View> */}
    </View>
  );
}
