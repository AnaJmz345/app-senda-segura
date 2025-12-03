import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function SOSEmergencyButton({ onPress }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 110,     // ajusta según tu UI
    right: 20,
    zIndex: 999,
  },
  button: {
    backgroundColor: "#D90000", 
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    fontStyle: "Bold",
  },
});
