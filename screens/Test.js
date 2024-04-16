import React, { useContext, useState } from "react";


export default function Test() {
  return (
    <View>
      <View>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <View>
        <Button title="Sign Up" color="#000" onPress={handleSignUp} />
      </View>
    </View>
  );
}
