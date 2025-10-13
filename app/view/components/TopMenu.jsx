import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TopMenu() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.header}>
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/11/78/12/32/360_F_1178123231_ouiY0cWqrOEFCYmoiJFeBc6oMVv9DBbL.jpg' }}
        style={styles.headerImage}
      />

      <View style={styles.menuContainer}>
    
        <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <Text
            style={[
              styles.menuText,
              route.name === 'Map' && styles.activeText,
            ]}
          >
            Mapa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text
            style={[
              styles.menuText,
              route.name === 'Profile' && styles.activeText,
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 100, 
  },
  menuText: {
    color: '#3A3A3A',
    fontSize: 20,
    fontWeight: '400',
   
  },
  activeText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
