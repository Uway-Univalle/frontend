import React from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const iconUguee = require('../assets/Uguee.png')
const iconMuevete = require('../assets/Muevete.png')

export default function InicioScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['rgba(77, 6, 131, 1)', 'rgba(186, 42, 243, 1)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}>
      <Image source = {iconUguee} style={styles.iconoUguee}/>
      <Image source = {iconMuevete} style={styles.icono}/>

      <TouchableOpacity
      onPress={() => navigation.navigate('Conductor')}>
      <LinearGradient
      colors={['#6817DA', '#8A4AE3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.button} >
      <View style={styles.buttonContent}>
      <Text style={styles.buttonText}>Sé un conductor</Text>
      <Ionicons name="arrow-forward-outline" size={24} color="#ffffff" style={{ marginLeft:10 }}/>
      </View>
      </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Pasajero')}>
        <LinearGradient
        colors={['#6817DA', '#8A4AE3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.button} >
        <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>¡Viaja con nosotros!</Text>
        <Ionicons name="arrow-forward-outline" size={24} color="#ffffff" style={{ marginLeft: 10 }}/>
        </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}>
        <LinearGradient
        colors={['#340378ff', '#6723c6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.button} >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' },
  iconoUguee: { 
    width: 300, 
    height: 200, 
    resizeMode: 'contain'},
  icono: { 
    width: 250, 
    height: 100, 
    marginBottom: 50, 
    resizeMode: 'contain'},
  button: { 
    padding: 15, 
    borderRadius: 15, 
    marginVertical: 10, 
    width: 300, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,},
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20},
  buttonText: { 
    color: '#fff', 
    fontSize: 20 },
});
