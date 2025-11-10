import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RegisterNewCaseScreen({ navigation }) {
  // const { user } = useAuth();

  const [form, setForm] = useState({
    bikerName: '',
    location: '',
    injuryType: '',
    severity: '',
    description: '',
    kitMaterial: '',
  });

  const [date, setDate] = useState(new Date());     
  const [showDate, setShowDate] = useState(false);   
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const onChangeDate = (_event, selected) => {
    setShowDate(false);
    if (selected) setDate(selected);
  };

  const handleSubmit = async () => {
    if (!form.bikerName || !form.location) {
      Alert.alert('Faltan datos', 'Nombre y ubicación son obligatorios.');
      return;
    }
    const isoDate = format(date, 'TIMESTAMPTZ');

    try {
      setLoading(true);

      Alert.alert('Guardado', 'El caso se registró correctamente.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo registrar el caso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Registrar <Text style={styles.headerBold}>caso nuevo</Text>
          </Text>
        </View>

        {/* Nombre */}
        <Text style={styles.label}>Nombre ciclista</Text>
        <TextInput
          style={styles.input}
          value={form.bikerName}
          onChangeText={t => onChange('bikerName', t)}
          placeholder="Nombre y apellidos"
        />

        {/* Fecha (botón que abre el picker) */}
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#333' }}>{format(date, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.select({ ios: 'spinner', android: 'default' })}
            onChange={onChangeDate}
          />
        )}

        {/* Ubicación */}
        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={t => onChange('location', t)}
          placeholder="Indica el tipo de ruta y la zona"
        />

        {/* Tipo de lesión */}
        <Text style={styles.label}>Tipo de lesión</Text>
        <TextInput
          style={styles.input}
          value={form.injuryType}
          onChangeText={t => onChange('injuryType', t)}
          placeholder="Ej. fractura, esguince, corte..."
        />

        {/* Severidad */}
        <Text style={styles.label}>Severidad</Text>
        <TextInput
          style={styles.input}
          value={form.severity}
          onChangeText={t => onChange('severity', t)}
          placeholder="Ej. leve, moderada, grave..."
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción de la lesión</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.description}
          onChangeText={t => onChange('description', t)}
          multiline
          numberOfLines={4}
          placeholder="Describe brevemente la lesión y el contexto…"
        />

        {/* Material */}
        <Text style={styles.label}>Material utilizado del kit primeros auxilios</Text>
        <TextInput
          style={styles.input}
          value={form.kitMaterial}
          onChangeText={t => onChange('kitMaterial', t)}
          placeholder="Lista de materiales usados"
        />

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Registrar caso nuevo</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, // respeta notch
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 24, color: '#1C4C2B', fontWeight: '600' },
  headerBold: { fontWeight: '900' },

  label: { marginTop: 12, marginBottom: 6, color: '#333', fontSize: 14 },
  input: {
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textarea: { height: 100, textAlignVertical: 'top' },

  picker: { height: Platform.OS === 'android' ? 48 : undefined, width: '100%' },
  submitBtn: {
    marginTop: 22,
    backgroundColor: '#3E6F4E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
