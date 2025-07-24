import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ConductorScreen() {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla del Conductor</Text>
      <Button
        title="Volver al Inicio"
        onPress={() => navigation.navigate('Inicio')}
        color="#2196F3"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});