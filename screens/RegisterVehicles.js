import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api';
import { VEHICLE_CATEGORIES, VEHICLE_TYPES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VehiculoScreen() {
  const navigation = useNavigation();

  const [marca, setMarca] = useState('');
  const [color, setColor] = useState('');
  const [placa, setPlaca] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [soatDate, setSoatDate] = useState(new Date());
  const [techDate, setTechDate] = useState(new Date());
  const [showSoatPicker, setShowSoatPicker] = useState(false);
  const [showTechPicker, setShowTechPicker] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [token, setToken] = useState('');

  const handleRegister = async () => {
    if (!marca || !modelo || !color || !placa || !capacidad || !selectedType || !selectedCategory) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await api.post('/api/vehicles/', {
        brand: marca,
        color: color,
        plate: placa,
        capacity: parseInt(capacidad),
        soat_valid_until: soatDate.toISOString().split('T')[0],
        tech_valid_until: techDate.toISOString().split('T')[0],
        vehicle_type: selectedType,
        vehicle_category: selectedCategory,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        
      if (response.status === 201) {
        alert('Vehículo registrado exitosamente.');
        navigation.navigate('Inicio');
      }
    } catch (error) {
      console.error('Error al registrar el vehículo:', error.response?.data || error.message);
      alert('Hubo un error al registrar el vehículo.');
    }
  };
 [];

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1A0A1F" />
      </TouchableOpacity>

      <Text style={styles.title}>Registro de Vehículo</Text>

      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor="#aaa"
        value={marca}
        onChangeText={setMarca}
      />

      <TextInput
        style={styles.input}
        placeholder="Color"
        placeholderTextColor="#aaa"
        value={color}
        onChangeText={setColor}
      />

      <TextInput
        style={styles.input}
        placeholder="Placa"
        placeholderTextColor="#aaa"
        value={placa}
        onChangeText={setPlaca}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacidad"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={capacidad}
        onChangeText={setCapacidad}
      />
      
      <Text style={styles.label}>📅 Fecha de SOAT</Text>
      <TouchableOpacity onPress={() => setShowSoatPicker(true)} style={styles.dateInput}>
        <Text>{soatDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showSoatPicker && (
        <DateTimePicker
          value={soatDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowSoatPicker(false);
            if (date) setSoatDate(date);
          }}
        />
      )}

      <Text style={styles.label}>📅 Fecha Tecnomecánica</Text>
      <TouchableOpacity onPress={() => setShowTechPicker(true)} style={styles.dateInput}>
        <Text>{techDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showTechPicker && (
        <DateTimePicker
          value={techDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowTechPicker(false);
            if (date) setTechDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Tipo de vehiculo</Text>
        <View style={styles.pickerContainer}>
        <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            style={Platform.select({
            ios: styles.pickerIOS,
            android: styles.pickerAndroid,
            })}
            dropdownIconColor="#1A0A1F"
        >
            <Picker.Item label="Selecciona una opción..." value="" />
            <Picker.Item label="Camioneta" value={VEHICLE_TYPES.VAN} />
            <Picker.Item label="Motocicleta" value={VEHICLE_TYPES.BIKE} />
            <Picker.Item label="Bus" value={VEHICLE_TYPES.BUS} />
            <Picker.Item label="Automovil" value={VEHICLE_TYPES.CAR} />
            <Picker.Item label="Patineta" value={VEHICLE_TYPES.SKATEBOARD} />
            <Picker.Item label="Triciclo" value={VEHICLE_TYPES.TRYCICLE} />
        </Picker>
        </View>      

        <Text style={styles.label}>Categoria de vehiculo</Text>
        <View style={styles.pickerContainer}>
        <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={Platform.select({
            ios: styles.pickerIOS,
            android: styles.pickerAndroid,
            })}
            dropdownIconColor="#1A0A1F"
        >
            <Picker.Item label="Selecciona una opción..." value="" />
            <Picker.Item label="Metropolitano" value={VEHICLE_CATEGORIES.METROPOLITAN} />
            <Picker.Item label="Campus" value={VEHICLE_CATEGORIES.CAMPUS} />
            <Picker.Item label="Intermunicipal" value={VEHICLE_CATEGORIES.INTERMUNICIPAL} />
            
        </Picker>
        </View>   
        
          

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar Vehículo</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
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
  dateInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
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
});