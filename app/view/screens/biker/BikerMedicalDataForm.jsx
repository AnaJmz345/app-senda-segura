import React  ,{useState,useEffect}from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView, TextInput,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 
import { useAuth } from '../../context/AuthContext';
import { MedicalDataController } from '../../../controllers/MedicalDataController';
import { logInfo,logError } from '../../../utils/logger';

export default function BikerMedicalDataForm({navigation}) {
  const { user } = useAuth();
 
  const [form, setForm] = useState({
    age: '',
    blood_type: 'O+',
    allergies: '',
    conditions: '',
    medications: '',
    emergency_contact_relation: '',
    emergency_contact_phone: ''
  });

  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const load = async () => {
      logInfo("[UI] Obteniendo datos médicos")
      const data = await MedicalDataController.loadMedicalData(user.id);
      if (data) {
        setForm({
          age: data.age?.toString() ?? '',
          blood_type: data.blood_type ?? 'O+',
          allergies: data.allergies ?? '',
          conditions: data.conditions ?? '',
          medications: data.medications ?? '',
          emergency_contact_relation: data.emergency_contact_relation ?? '',
          emergency_contact_phone: data.emergency_contact_phone ?? '',
        });
      }
    };

    load();
  }, []);


  const handleSaveBtn = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      logInfo("[UI] Enviando formulario:", form);
      await MedicalDataController.saveMedicalData(user.id, form);
      Alert.alert("Éxito", "Datos guardados correctamente");
    } catch (error) {
      logError("[UI] Error recibido del controller:", error);
      Alert.alert("Error", error.message);
    }

    setIsEditing(false);
  };



  return (
    <ScrollView style={styles.container}>
      {/* Botón arriba */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Título centrado verticalmente */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Datos Médicos</Text>
      </View>
      <View style={styles.formContainer}>

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          keyboardType="numeric"
          value={form.age}
          
          onChangeText={(text) => setForm({ ...form, age: text })}
        />

        <Text style={styles.label}>Tipo de sangre</Text>
        <View style={[styles.pickerContainer, !isEditing && styles.inputDisabled]}>
          <Picker
            selectedValue={form.blood_type}
            enabled={isEditing} 
            onValueChange={(value) => setForm({ ...form, blood_type: value })}
            style={styles.picker}
          >
            <Picker.Item label="O +" value="O+" />
            <Picker.Item label="O -" value="O-" />
            <Picker.Item label="A +" value="A+" />
            <Picker.Item label="A -" value="A-" />
            <Picker.Item label="B +" value="B+" />
            <Picker.Item label="B -" value="B-" />
            <Picker.Item label="AB +" value="AB+" />
            <Picker.Item label="AB -" value="AB-" />
          </Picker>
        </View>

        <Text style={styles.label}>Alergias</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          value={form.allergies}
          onChangeText={(text) => setForm({ ...form, allergies: text })}
        />

        <Text style={styles.label}>Padecimientos crónicos</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          value={form.conditions}
          onChangeText={(text) => setForm({ ...form, conditions: text })}
        />

        <Text style={styles.label}>Medicamentos actuales</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          value={form.medications}
          onChangeText={(text) => setForm({ ...form, medications: text })}
        />

        <Text style={styles.label}>Contacto de emergencia (cel.)</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          keyboardType="phone-pad"
          value={form.emergency_contact_phone}
          onChangeText={(text) => setForm({ ...form, emergency_contact_phone: text })}
        />

        <Text style={styles.label}>Contacto de emergencia (parentesco)</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}  
          value={form.emergency_contact_relation}
          onChangeText={(text) => setForm({ ...form, emergency_contact_relation: text })}
        />
      </View>

      {/* Botón guardar */}
      <TouchableOpacity style={styles.saveButton}  onPress={handleSaveBtn}>
        <Text style={styles.saveButtonText}>{isEditing ? 'Guardar cambios' : 'Editar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F8F8',
  },
  backButtonContainer: {
    position: 'absolute', 
    top: 40,
    left: 20,
  },
  button: {
    backgroundColor: '#D19761',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  titleContainer: {
    flex: 1,
    marginTop: 45,
    alignItems: 'center',  
  },
  title: { 
    fontSize: 22, 
    fontWeight: '600',
    color: 'black',
  },
  formContainer: {
    margin: 30,
    
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 6,
  },
   input: {
    backgroundColor: '#E8E5E1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  pickerContainer: {
    backgroundColor: '#E8E5E1',
    borderRadius: 8,
    marginBottom: 18,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#D19761',
    fontWeight: '700',
    fontSize: 16,
  },
});