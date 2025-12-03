import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function AddMarkerModal({ 
  visible, 
  onClose, 
  onSave, 
  coordinates 
}) {
  const [type, setType] = useState('first_aid');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setType('first_aid');
    setName('');
    setDescription('');
    setSaving(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    const markerData = {
      type,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      name: name.trim() || null,
      description: description.trim() || null
    };

    const success = await onSave(markerData);

    setSaving(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  const getTypeLabel = (markerType) => {
    return markerType === 'first_aid' ? 'Botiquín' : 'Zona con Señal';
  };

  const getTypeIcon = (markerType) => {
    return markerType === 'first_aid' ? 'first-aid' : 'signal-cellular-4-bar';
  };

  const getTypeColor = (markerType) => {
    return markerType === 'first_aid' ? '#FF4444' : '#4CAF50';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Agregar Marcador</Text>
              <TouchableOpacity onPress={handleClose} disabled={saving}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Coordenadas */}
            <View style={styles.coordsContainer}>
              <MaterialIcons name="place" size={20} color={COLORS.darkGreen} />
              <Text style={styles.coordsText}>
                Lat: {coordinates?.latitude.toFixed(6)}, Lng: {coordinates?.longitude.toFixed(6)}
              </Text>
            </View>

            {/* Selector de Tipo */}
            <View style={styles.section}>
              <Text style={styles.label}>Tipo de Marcador *</Text>
              <View style={styles.typeSelector}>
                {/* Botiquín */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    type === 'first_aid' && styles.typeOptionSelected,
                    type === 'first_aid' && { borderColor: '#FF4444' }
                  ]}
                  onPress={() => setType('first_aid')}
                  disabled={saving}
                >
                  <FontAwesome5 
                    name="first-aid" 
                    size={32} 
                    color={type === 'first_aid' ? '#FF4444' : '#CCC'} 
                  />
                  <Text 
                    style={[
                      styles.typeLabel,
                      type === 'first_aid' && styles.typeLabelSelected
                    ]}
                  >
                    Botiquín
                  </Text>
                </TouchableOpacity>

                {/* Señal */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    type === 'cell_signal' && styles.typeOptionSelected,
                    type === 'cell_signal' && { borderColor: '#4CAF50' }
                  ]}
                  onPress={() => setType('cell_signal')}
                  disabled={saving}
                >
                  <MaterialIcons 
                    name="signal-cellular-4-bar" 
                    size={32} 
                    color={type === 'cell_signal' ? '#4CAF50' : '#CCC'} 
                  />
                  <Text 
                    style={[
                      styles.typeLabel,
                      type === 'cell_signal' && styles.typeLabelSelected
                    ]}
                  >
                    Zona con Señal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nombre (opcional) */}
            <View style={styles.section}>
              <Text style={styles.label}>Nombre (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ej: ${type === 'first_aid' ? 'Botiquín Entrada' : 'Zona Norte'}`}
                value={name}
                onChangeText={setName}
                editable={!saving}
                maxLength={100}
              />
            </View>

            {/* Descripción (opcional) */}
            <View style={styles.section}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={`Ej: ${type === 'first_aid' ? 'Cerca de la entrada principal' : 'Buena cobertura en esta área'}`}
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.saveButton,
                  { backgroundColor: getTypeColor(type) },
                  saving && styles.buttonDisabled
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <FontAwesome5 
                      name={getTypeIcon(type)} 
                      size={16} 
                      color="#FFF" 
                    />
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
  },
  coordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  coordsText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  typeOptionSelected: {
    backgroundColor: '#FFF',
    borderWidth: 3,
  },
  typeLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  typeLabelSelected: {
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: COLORS.mediumGreen,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});