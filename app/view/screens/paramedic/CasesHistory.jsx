import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import TopMenu from '../../components/TopMenu';
import CaseHistoryList from '../../components/CaseHistoryList';
import { useAuth } from '../../context/AuthContext';

export default function CasesHistory({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <TopMenu navigation={navigation} />
      <View style={styles.content}>
        <CaseHistoryList 
          paramedicId={user?.id} 
          showAllParamedics={false} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
  },
});