import { useState } from 'react';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { USER_TYPES } from '../constants';

export default function LoginScreen({ navigation, setUserType }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secure, setSecure] = useState(true)
  const iconUguee = require('../assets/Uguee.png')
  const handleLogin = async () => {

    if (!username.trim() || !password.trim()) {
      alert('Por favor ingresa el usuario y la contraseña.');
      return;
    }

    try {
      const response = await api.post('/api/login/', {
        username,
        password,
      });

      if (response.data.access && Object.values(USER_TYPES).includes(response.data.user.user_type)) {
    
        await AsyncStorage.setItem('token', response.data.access);
        const userType = response.data.user.user_type.toString();
        await AsyncStorage.setItem('user_type', userType);
        setUserType(userType);
        
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error.response.data);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={iconUguee} style={styles.iconoUguee} />
        <View style={{ width: '80%', alignItems: 'flex-start' }}>
          <Text style={styles.text}>¡Bienvenid@!</Text>
          <Text style={styles.subtitle}>Tu app de transporte de confianza</Text>
          <Text style={styles.label}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Username o Email"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none" /></View>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="**********"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#555"
                style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['#340378ff', '#6723c6ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button} >
            <Text style={styles.buttonText}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
          <Text style={styles.back}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconoUguee: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
  text: {
    width: 190,
    height: 50,
    fontFamily: "Quicksand",
    fontSize: 30,
    fontWeight: '700',
    textAlign: "left",
    color: "#35424A"
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginBottom: 30
  },
  label: {
    color: '#8A4AE3',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingRight: 5
  },
  button: {
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  },
  forgot: {
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
    marginBottom: 25,
    marginTop: 10
  },
  back: {
    textAlign: 'center',
    fontSize: 15,
    color: '#8A4AE3',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
});
