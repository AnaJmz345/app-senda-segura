import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/colors';

const RegisterNewCaseScreen = () => {
  const [bikerName, setBikerName] = useState('Jorge Suárez');
  const [date, setDate] = useState('15/08/2025');
  const [location, setLocation] = useState('-15.26598, 65.2867');
  const [injuryType, setInjuryType] = useState('Fractura');
  const [severity, setSeverity] = useState('Moderada');
  const [injuryDescription, setInjuryDescription] = useState('Fractura no expuesta de la clavicula izquierda...');
  const [firstAidMaterial, setFirstAidMaterial] = useState('Alcohol desinfectante');

  const handleRegister = () => {
    const newCase = {
      bikerName,
      date,
      location,
      injuryType,
      severity,
      injuryDescription,
      firstAidMaterial,
    };
    console.log('Registering new case:', newCase);
    // this is a placeholder for the moment, need to send it to backend.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Registrar caso nuevo</Text>
        </View>
        
        <Text style={styles.label}>Nombre ciclista</Text>
        <TextInput
          style={styles.input}
          value={bikerName}
          onChangeText={setBikerName}
        />

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        {/* These should be dropdown pickers */}
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
          </Picker>
        </View>

        <Text style={styles.label}>Severidad</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={severity}
            style={styles.picker}
            onValueChange={(itemValue) => setSeverity(itemValue)}
          >
            <Picker.Item label="Leve" value="Leve" />
            <Picker.Item label="Moderada" value="Moderada" />
            <Picker.Item label="Grave" value="Grave" />
          </Picker>
        </View>

        <Text style={styles.label}>Descripción de la lesión</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={injuryDescription}
          onChangeText={setInjuryDescription}
          multiline
        />

        <Text style={styles.label}>Material utilizado del kit primeros auxilios</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={firstAidMaterial}
            style={styles.picker}
            onValueChange={(itemValue) => setFirstAidMaterial(itemValue)}
          >
            <Picker.Item label="Alcohol desinfectante" value="Alcohol desinfectante" />
            <Picker.Item label="Gasas" value="Gasas" />
            <Picker.Item label="Vendas" value="Vendas" />
            <Picker.Item label="Analgésicos" value="Analgésicos" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar caso nuevo</Text>
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