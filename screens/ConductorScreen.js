import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function ConductorScreen() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('Inicio')}>
        <Ionicons name="arrow-back" size={24} color="#1A0A1F" />
      </TouchableOpacity>

      <Text style={styles.title}>Ingresa tus datos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#aaa"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Documento"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={documento}
        onChangeText={setDocumento}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Text style={styles.label}>¿Qué eres?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoUsuario}
          onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          style={Platform.select({
            ios: styles.pickerIOS,
            android: styles.pickerAndroid,
          })}
          dropdownIconColor="#1A0A1F"
        >
          <Picker.Item label="Selecciona una opción..." value="" />
          <Picker.Item label="Estudiante" value="Estudiante" />
          <Picker.Item label="Profesor" value="Profesor" />
          <Picker.Item label="Administrativo" value="Administrativo" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={() => {/* Acción al registrarse */}}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>Tengo una cuenta</Text>
      </TouchableOpacity>
 

    </ScrollView>
  );


}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1A0A1F',
    padding: 20,
    paddingTop: 80,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 75,
    left: 30,
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#ccc',
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  pickerIOS: {
    height: 200,
    width: '100%',
    color: '#000',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1A0A1F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#6864D9',
    width: '100%',
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    width: 137,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
},

  loginLinkText: {
   color: '#0167FF',
   fontSize: 14,
   fontWeight: 'bold',
   textDecorationLine: 'none',
},


});
