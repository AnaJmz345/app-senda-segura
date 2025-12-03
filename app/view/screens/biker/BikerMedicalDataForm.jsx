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
import { logInfo, logError } from '../../../utils/logger';

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
    return (
      <>
        <TouchableOpacity
          style={[styles.input, !isEditing && styles.inputDisabled]}
          onPress={() => isEditing && setShowBloodTypePicker(true)}
          disabled={!isEditing}
          activeOpacity={0.7}
        >
          <Text style={styles.pickerButtonText}>{form.blood_type}</Text>
          {isEditing && <Ionicons name="chevron-down" size={20} color="#666" />}
        </TouchableOpacity>

        <Modal
          visible={showBloodTypePicker}
          transparent={true}
          animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
          onRequestClose={() => setShowBloodTypePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowBloodTypePicker(false)}
          >
            <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : styles.androidPickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Tipo de sangre</Text>
                <TouchableOpacity onPress={() => setShowBloodTypePicker(false)}>
                  <Text style={styles.pickerDoneButton}>
                    {Platform.OS === 'ios' ? 'Listo' : '×'}
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerList}>
                {bloodTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.pickerItem,
                      form.blood_type === type.value && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setForm({ ...form, blood_type: type.value });
                      setShowBloodTypePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      form.blood_type === type.value && styles.pickerItemTextSelected
                    ]}>
                      {type.label}
                    </Text>
                    {form.blood_type === type.value && (
                      <Ionicons name="checkmark" size={24} color="#D19761" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    alignItems: Platform.OS === 'ios' ? 'stretch' : 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '50%',
  },
  androidPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pickerDoneButton: {
    color: '#D19761',
    fontSize: Platform.OS === 'ios' ? 17 : 28,
    fontWeight: '600',
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerItemSelected: {
    backgroundColor: '#FFF5ED',
  },
  pickerItemText: {
    fontSize: 17,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#D19761',
    fontWeight: '600',
  },
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