
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function ParamedicProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={ require('../../../../assets/gatitoprofile.jpeg') }
        style={styles.avatar}
      />
      <Text style={styles.name}>Pablo Medina</Text>
      <Text style={styles.subtitle}>
        Gracias por tu servicio, Pablo. Tu ayuda es importante y marca la diferencia.
      </Text>

      <View style={styles.actions}>
        <View style={styles.buttonContainer}>
          <Button
            title="Registrar caso nuevo"
            color={colors.primary}
            onPress={() => navigation.navigate('RegisterNewCaseScreen')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Ver Bikers activos"
            color={colors.secondary}
            onPress={() => navigation.navigate('ActiveBikersScreen')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Ver historial de casos"
            color={colors.darkGreen}
            onPress={() => navigation.navigate('EmergencyCallsHistory')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textGray,
    marginVertical: 10,
  },
  actions: {
    marginTop: 20,
    width: '100%',
  },
  buttonContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

