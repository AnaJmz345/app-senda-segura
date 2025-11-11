import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { ParamedicCaseController } from '../../../controllers/ParamedicCaseController';
import { ParamedicCaseModel } from '../../../models/ParamedicCaseModel';

const RegisterNewCaseScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bikerName, setBikerName] = useState('');
  const [bikers, setBikers] = useState([]);
  const [loadingBikers, setLoadingBikers] = useState(true);
  const [injuryType, setInjuryType] = useState('Fractura');
  const [injuryDescription, setInjuryDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Load bikers on mount
  React.useEffect(() => {
    const loadBikers = async () => {
      try {
        const bikersList = await ParamedicCaseModel.getAllBikers();
        setBikers(bikersList || []);
      } catch (error) {
        console.error('Error loading bikers:', error);
        Alert.alert('Error', 'No se pudieron cargar los ciclistas');
      } finally {
        setLoadingBikers(false);
      }
    };

    loadBikers();
  }, []);

  const handleRegister = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    const newCase = {
      bikerName,
      injuryType,
      injuryDescription,
      emergencyId: null, // Por ahora null
    };

    try {
      setLoading(true);
      await ParamedicCaseController.createCase(user.id, newCase);
      
      // Clear form
      setBikerName('');
      setInjuryDescription('');
      setInjuryType('Fractura');
      
      // Navigate to ParamedicProfileScreen immediately
      if (navigation) {
        navigation.navigate('ParamedicProfileScreen');
      }
    } catch (error) {
      console.error('Error registering case:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar el caso. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Registrar caso nuevo</Text>
        </View>
        
        <Text style={styles.label}>Ciclista</Text>
        {loadingBikers ? (
          <View style={styles.input}>
            <ActivityIndicator size="small" color={COLORS.mediumGreen} />
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={bikerName}
              style={styles.picker}
              onValueChange={(itemValue) => setBikerName(itemValue)}
            >
              <Picker.Item label="Seleccione un ciclista" value="" />
              {bikers.map((biker) => (
                <Picker.Item 
                  key={biker.id} 
                  label={biker.display_name} 
                  value={biker.display_name} 
                />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Tipo de lesión</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={injuryType}
            style={styles.picker}
            onValueChange={(itemValue) => setInjuryType(itemValue)}
          >
            <Picker.Item label="Fractura" value="Fractura" />
            <Picker.Item label="Contusión" value="Contusión" />
            <Picker.Item label="Esguince" value="Esguince" />
            <Picker.Item label="Herida abierta" value="Herida abierta" />
            <Picker.Item label="Laceración" value="Laceración" />
            <Picker.Item label="Quemadura" value="Quemadura" />
            <Picker.Item label="Otro" value="Otro" />
          </Picker>
        </View>

        <Text style={styles.label}>Descripción de la lesión</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={injuryDescription}
          onChangeText={setInjuryDescription}
          placeholder="Describa los detalles de la lesión y el tratamiento aplicado"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Registrar caso nuevo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGreen,
    opacity: 0.7,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default RegisterNewCaseScreen;