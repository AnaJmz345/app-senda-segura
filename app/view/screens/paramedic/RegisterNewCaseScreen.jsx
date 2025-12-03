import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, 
  SafeAreaView, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { ParamedicCaseController } from '../../../controllers/ParamedicCaseController';
import { ParamedicCaseModel } from '../../../models/ParamedicCaseModel';
import { Ionicons } from '@expo/vector-icons';

const RegisterNewCaseScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bikerName, setBikerName] = useState('');
  const [bikers, setBikers] = useState([]);
  const [loadingBikers, setLoadingBikers] = useState(true);
  const [injuryType, setInjuryType] = useState('Fractura');
  const [injuryDescription, setInjuryDescription] = useState('');
  const [loading, setLoading] = useState(false);

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
      emergencyId: null,
    };

    try {
      setLoading(true);
      await ParamedicCaseController.createCase(user.id, newCase);

      setBikerName('');
      setInjuryDescription('');
      setInjuryType('Fractura');

      navigation.navigate('ParamedicProfileScreen');
      
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

        {/* FIX: rename button style */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={27} color="black" />
          </TouchableOpacity>
        </View>

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
          style={[styles.mainButton, loading && styles.buttonDisabled]} 
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

  backButtonContainer: { position: 'absolute', top: 0, left: 0 },

  backButton: {
    backgroundColor: '#D19761',
    paddingTop: 8,
    paddingLeft: 5,
    padding: 6,
    borderRadius: 6,
  },

  container: {
    flex: 1,
    padding: 30,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerText: {
    paddingLeft: 60,
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkGreen,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
    marginTop: 60,
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

  mainButton: {
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
  height: 55,
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
},


picker: {
  width: '100%',
  height: 200, 
  position: Platform.OS === 'ios' ? 'absolute' : 'relative',
  top: Platform.OS === 'ios' ? -81 : 0,   
},

});

export default RegisterNewCaseScreen;
