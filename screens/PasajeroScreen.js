<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native';

=======
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { USER_TYPES, PASSENGER_TYPES } from '../constants'
import api from '../api';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@env';
>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6

export default function PasajeroScreen() {
  const navigation = useNavigation();

  const [contrasena, setContrasena] = useState('');
<<<<<<< HEAD
  const [image, setImage] = useState(null);
  const rutas = [
    {
      id: '1',
      nombre: 'Japeto',
      calificacion: 4.5,
      hora: '10:00pm',
      ruta: 'Melendez - Vergel',
      imagen: 'https://i.imgur.com/0y8Ftya.png',
    },
    {
      id: '2',
      nombre: 'Japeto',
      calificacion: 4.5,
      hora: '10:00pm',
      ruta: 'Melendez - Vergel',
      imagen: 'https://i.imgur.com/0y8Ftya.png',
    },
    {
      id: '3',
      nombre: 'Japeto',
      calificacion: 4.5,
      hora: '10:00pm',
      ruta: 'Melendez - Vergel',
      imagen: 'https://i.imgur.com/0y8Ftya.png',
    },
    {
      id: '4',
      nombre: 'Japeto',
      calificacion: 4.5,
      hora: '10:00pm',
      ruta: 'Melendez - Vergel',
      imagen: 'https://i.imgur.com/0y8Ftya.png',
    },
];
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
=======
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
>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6

  return (

  <View style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('Inicio')}>
        <Ionicons name="arrow-back" size={24} color="#1A0A1F" />
      </TouchableOpacity>

      <Text style={styles.title}>Ingresa tus datos</Text>

<<<<<<< HEAD
      <FlatList
        data={rutas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.nombre}>
                {item.nombre} <Text style={styles.rating}>{item.calificacion} ★</Text>
              </Text>
              <Text style={styles.hora}>
                {item.hora} - {item.ruta}
              </Text>
              <TouchableOpacity style={styles.verRuta}>
                <Text style={styles.verRutaText}>Ver ruta</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: item.imagen }} style={styles.avatar} />
          </View>
        )}
=======
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
>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6
      />
    </View>

<<<<<<< HEAD
    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}


    {/* Botón flotante único */}
    <View style={styles.floatingButtons}>
      <TouchableOpacity style={styles.iconButton}>
        <Feather name="search" size={24} color="#000" />
=======
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
>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Feather name="filter" size={24} color="#000" />
      </TouchableOpacity>
<<<<<<< HEAD
    </View>
  </View>
);
=======


    </ScrollView>
  );

>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1A0A1F',
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100, // espacio para botón flotante
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
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  loginLink: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
<<<<<<< HEAD
    marginTop: 15,
  },
=======
    marginTop: 10,
  },

>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6
  loginLinkText: {
    color: '#0167FF',
    fontSize: 14,
    fontWeight: 'bold',
<<<<<<< HEAD
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 40,
    marginHorizontal: '25%',
    gap: 20,
  },
  iconButton: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 15,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#000',
},

  cardLeft: {
    flex: 1,
    paddingRight: 10,
},
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
},
  rating: {
    color: '#0167FF',
  },
  hora: {
    color: '#333',
    marginBottom: 8,
},
  verRuta: {
    backgroundColor: '#0167FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
},
  verRutaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
},
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
},

=======
    textDecorationLine: 'none',
  },

>>>>>>> 21410e92c65b62aa62c63bb69c427c199b29a1c6
});
