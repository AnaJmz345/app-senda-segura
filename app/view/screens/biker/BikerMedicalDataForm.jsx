import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { MedicalDataController } from '../../../controllers/MedicalDataController';
<<<<<<< HEAD
import { logInfo,logError } from '../../../utils/logger';
import { Platform } from 'react-native';
=======
import { logInfo, logError } from '../../../utils/logger';
>>>>>>> 68f89b19fe2e08bbc75a2800e3bf4c49d5887050

export default function BikerMedicalDataForm({ navigation }) {
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
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);

  const bloodTypes = [
    { label: 'O +', value: 'O+' },
    { label: 'O -', value: 'O-' },
    { label: 'A +', value: 'A+' },
    { label: 'A -', value: 'A-' },
    { label: 'B +', value: 'B+' },
    { label: 'B -', value: 'B-' },
    { label: 'AB +', value: 'AB+' },
    { label: 'AB -', value: 'AB-' }
  ];

  useEffect(() => {
    const load = async () => {
      logInfo("[UI] Obteniendo datos médicos");
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

  const renderBloodTypePicker = () => {
    if (Platform.OS === 'ios') {
      // Picker estilo iOS con Modal
      return (
        <>
          <TouchableOpacity
            style={[styles.input, !isEditing && styles.inputDisabled]}
            onPress={() => isEditing && setShowBloodTypePicker(true)}
            disabled={!isEditing}
          >
            <Text style={styles.pickerButtonText}>{form.blood_type}</Text>
            {isEditing && <Ionicons name="chevron-down" size={20} color="#666" />}
          </TouchableOpacity>

          <Modal
            visible={showBloodTypePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowBloodTypePicker(false)}>
                    <Text style={styles.modalDoneButton}>Listo</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={form.blood_type}
                  onValueChange={(value) => setForm({ ...form, blood_type: value })}
                  style={styles.iosPicker}
                >
                  {bloodTypes.map((type) => (
                    <Picker.Item 
                      key={type.value} 
                      label={type.label} 
                      value={type.value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>
        </>
      );
    } else {
      // Picker estilo Android (dropdown nativo)
      return (
        <View style={[styles.pickerContainer, !isEditing && styles.inputDisabled]}>
          <Picker
            selectedValue={form.blood_type}
            enabled={isEditing}
            onValueChange={(value) => setForm({ ...form, blood_type: value })}
            style={styles.picker}
          >
            {bloodTypes.map((type) => (
              <Picker.Item 
                key={type.value} 
                label={type.label} 
                value={type.value} 
              />
            ))}
          </Picker>
        </View>
      );
    }
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
        {renderBloodTypePicker()}

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
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveBtn}>
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Guardar cambios' : 'Editar'}
        </Text>
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
<<<<<<< HEAD
    position: 'absolute', 
    top: 50,
=======
    position: 'absolute',
    top: 40,
>>>>>>> 68f89b19fe2e08bbc75a2800e3bf4c49d5887050
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
<<<<<<< HEAD
    marginTop: 75,
    alignItems: 'center',  
=======
    marginTop: 45,
    alignItems: 'center',
>>>>>>> 68f89b19fe2e08bbc75a2800e3bf4c49d5887050
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputDisabled: {
    opacity: 0.5,
  },
<<<<<<< HEAD
pickerContainer: {
  backgroundColor: '#E8E5E1',
  borderRadius: 8,
  marginBottom: 18,
  height: 50,          
  justifyContent: 'center',
  overflow: 'hidden',    
},

picker: {
  width: '100%',
  height: Platform.OS === 'ios' ? 210 : 50, 
  position: Platform.OS === 'ios' ? 'absolute' : 'relative',
  top: Platform.OS === 'ios' ? -80 : 0,      
},

=======
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
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
  // Estilos del Modal para iOS
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area para iPhone
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalDoneButton: {
    color: '#D19761',
    fontSize: 17,
    fontWeight: '600',
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
>>>>>>> 68f89b19fe2e08bbc75a2800e3bf4c49d5887050
  saveButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#D19761',
    fontWeight: '700',
    fontSize: 16,
  },
});