import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function PrimaryButton({ title, color = colors.primary, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  text: {
    color: '#1e1e1eff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
