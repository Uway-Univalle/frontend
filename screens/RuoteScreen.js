import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FlatList } from 'react-native';


export default function ConductorScreen() {
  const navigation = useNavigation();

  const [contrasena, setContrasena] = useState('');
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

  return (

  <View style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('Inicio')}>
        <Ionicons name="arrow-back" size={24} color="#1A0A1F" />
      </TouchableOpacity>

      <Text style={styles.title}>Rutas Disponibles</Text>

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
      />
    </View>

    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

    <TouchableOpacity style={styles.button} onPress={pickImage}>
      <Text style={styles.buttonText}>Subir imagen</Text>
    </TouchableOpacity>

    {/* Botón flotante único */}
    <View style={styles.floatingButtons}>
      <TouchableOpacity style={styles.iconButton}>
        <Feather name="search" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Feather name="filter" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

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
    marginTop: 15,
  },
  loginLinkText: {
    color: '#0167FF',
    fontSize: 14,
    fontWeight: 'bold',
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

});


