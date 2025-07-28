import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { VEHICLE_STATE_MAP } from '../constants'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';

const MyVehiclesScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchVehicles = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.warn('Token no encontrado');
            return;
          }

          const response = await api.get('/api/vehicles/', {
            headers: { Authorization: `Bearer ${token}` }
          });

          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchVehicles();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="car-sport-outline" size={28} color="#007bff" style={styles.icon} />

      <Text style={styles.title}>{item.brand} {item.model}</Text>
      <Text style={styles.subtitle}>📄 Placa: {item.plate}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Verificado:</Text>
        <Ionicons
          name={item.is_verified ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={item.is_verified ? 'green' : 'red'}
          style={{ marginLeft: 4 }}
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Estado:</Text>
        <Text style={[styles.infoLabel, { color: VEHICLE_STATE_MAP[item.state]?.color || 'black' }]}>
          {VEHICLE_STATE_MAP[item.state]?.label || 'Desconocido'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text>No tienes vehículos registrados.</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Registrar Vehiculo')} // Ajusta según el nombre de tu pantalla
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyVehiclesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center'
  },
  icon: {
    marginBottom: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  subtitle: {
    fontSize: 15,
    color: '#666'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    padding: 16,
    elevation: 5
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500'
  }
});
