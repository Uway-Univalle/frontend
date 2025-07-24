import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PasajeroScreen() {
    const navigation = useNavigation();
    
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla del Pasajero</Text>
      <Button
        title="Volver al Inicio"
        onPress={() => navigation.navigate('Inicio')}
        color="#2196F3"
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});
