import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { USER_TYPES, PASSENGER_TYPES } from '../constants'
import api from '../api';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@env';

export default function PasajeroScreen() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [tipoPasajero, setTipoPasajero] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!nombre || !apellido || !documento || !correo || !contrasena || !direccion || !telefono || !selectedCollege || !tipoPasajero) {
      alert('Por favor completa todos los campos.');
      return;
    }
    if (!esEmailValido(correo)) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    try {
      const response = await api.post('/api/users/', {
        username: `${nombre}${apellido}`,
        email: correo,
        personal_id: documento,
        address: direccion,
        phone: telefono,
        code: codigo,
        user_type: USER_TYPES.PASSENGER,
        passenger_type: tipoPasajero,
        college: selectedCollege,
        password: contrasena,
        attachments: []
      });

      if (response.status === 201) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigation.navigate('Login');
      }

    } catch (error) {
      if (error.response) {
        console.error('Backend respondió con error:', error.response.data);
      } else if (error.request) {
        console.error('No hubo respuesta del servidor:', error.request);
      } else {
        console.error('Error al configurar la petición:', error.message);
      }
      alert('Error al registrarse');
    }
  };

  useEffect(() => {
    const fetchTokenAndColleges = async () => {
      try {
        const loginResponse = await api.post('/api/login/', {
          username: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        });

        const admin_token = loginResponse.data.access;

        const collegeResponse = await api.get('/api/colleges/', {
          headers: {
            Authorization: `Bearer ${admin_token}`,
          },
        });

        if (collegeResponse.status === 200) {
          setUniversidades(collegeResponse.data);
        }
      } catch (error) {
        console.error('Error al obtener universidades:', error.response?.data || error.message);
        alert('No se pudieron cargar las universidades.');
      }
    };

    fetchTokenAndColleges();
  }, []);

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
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        placeholderTextColor="#aaa"
        value={direccion}
        onChangeText={setDireccion}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TextInput
        style={styles.input}
        placeholder="Código"
        placeholderTextColor="#aaa"
        value={codigo}
        onChangeText={setCodigo}
      />

      <Text style={styles.label}>Universidad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCollege}
          onValueChange={(itemValue) => setSelectedCollege(itemValue)}
          style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
        >
          <Picker.Item label="Selecciona una universidad" value={null} />
          {universidades.map((college) => (
            <Picker.Item key={college.college_id} label={college.name} value={college.college_id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Perfil Universitario</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoPasajero}
          onValueChange={(itemValue) => setTipoPasajero(itemValue)}
          style={Platform.select({
            ios: styles.pickerIOS,
            android: styles.pickerAndroid,
          })}
          dropdownIconColor="#1A0A1F"
        >
          <Picker.Item label="Selecciona una opción..." value="" />
          <Picker.Item label="Estudiante" value={PASSENGER_TYPES.STUDENT} />
          <Picker.Item label="Profesor" value={PASSENGER_TYPES.PROFESSOR} />
          <Picker.Item label="Administrativo" value={PASSENGER_TYPES.STAFF} />
        </Picker>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
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
