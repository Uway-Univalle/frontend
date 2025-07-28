import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal, TextInput,
  Button, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api';

export default function PasajeroHomeScreen() {
  const [rutas, setRutas] = useState([]);
  const [filteredRutas, setFilteredRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState({ visible: false, mode: 'start' });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    try {
      const response = await api.get('/api/trips');
      const disponibles = response.data.filter((ruta) => ruta.status === 'AVAILABLE');
      setRutas(disponibles);
      setFilteredRutas(disponibles);
    } catch (error) {
      console.error('Error al obtener las rutas:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async () => {
    try {
      if (startDate && endDate) {
        const after = startDate.toISOString().split('T')[0]; // formato YYYY-MM-DD
        const before = endDate.toISOString().split('T')[0];

        const response = await api.get('/api/trips', {
          params: {
            date_after: after,
            date_before: before,
            status: 'disponible'
          }
        });

        setFilteredRutas(response.data);
      }
    } catch (error) {
      console.error('Error al filtrar rutas por fecha:', error);
    } finally {
      setShowFilterModal(false);
    }
 };

  const applySearch = () => {
    const search = searchText.toLowerCase();
    const filtered = rutas.filter((ruta) =>
      ruta.name?.toLowerCase().includes(search)
    );
    setFilteredRutas(filtered);
    setShowSearchModal(false);
    setSearchText('');
  };

  const renderRuta = ({ item }) => (
    <View style={styles.rutaCard}>
      <Text style={styles.text}>Origen: {item.origin}</Text>
      <Text style={styles.text}>Destino: {item.destination}</Text>
      <Text style={styles.text}>Fecha: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas Disponibles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={filteredRutas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRuta}
          ListEmptyComponent={<Text style={styles.text}>No hay rutas disponibles</Text>}
        />
      )}

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => setShowSearchModal(true)}>
          <Text style={styles.buttonText}>Buscar Ruta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowFilterModal(true)}>
          <Text style={styles.buttonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL BUSCAR */}
      <Modal visible={showSearchModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Buscar por destino</Text>
            <TextInput
              placeholder="Ej: Melendez"
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
            />
            <Button title="Buscar" onPress={applySearch} />
            <Button title="Cancelar" color="red" onPress={() => setShowSearchModal(false)} />
          </View>
        </View>
      </Modal>

      {/* MODAL FILTRO FECHAS */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Filtrar por fechas</Text>

            <TouchableOpacity onPress={() => setShowDatePicker({ visible: true, mode: 'start' })}>
              <Text style={styles.buttonText}>
                {startDate ? `Desde: ${startDate.toLocaleDateString()}` : 'Seleccionar fecha de inicio'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDatePicker({ visible: true, mode: 'end' })}>
              <Text style={styles.buttonText}>
                {endDate ? `Hasta: ${endDate.toLocaleDateString()}` : 'Seleccionar fecha final'}
              </Text>
            </TouchableOpacity>

            <Button title="Aplicar Filtro" onPress={applyFilter} />
            <Button title="Cancelar" color="red" onPress={() => setShowFilterModal(false)} />
          </View>
        </View>
      </Modal>

      {showDatePicker.visible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              if (showDatePicker.mode === 'start') {
                setStartDate(selectedDate);
              } else {
                setEndDate(selectedDate);
              }
            }
            setShowDatePicker({ visible: false, mode: 'start' });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 4 },
  rutaCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6
  }
});
