import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView,View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../api';


const MyVehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('Token no encontrado');
          return;
        }

        const response = await api.get('/api/vehicles/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Vehículos:', response.data);
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>🚗 {item.brand} {item.model}</Text>
      <Text style={styles.text}>📄 Placa: {item.plate}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No tienes vehículos registrados.</Text>}
      />
    </SafeAreaView>
  );
};

export default MyVehiclesScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1,
    padding: 20
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  }
});
