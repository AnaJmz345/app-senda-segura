import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopMenu from '../../components/TopMenu';

export default function AdminMapScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation={navigation} />

        <Text style={{ marginTop: 30, textAlign: 'center' }}>SOY UN MAPA</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flexGrow: 1,
  },
});
