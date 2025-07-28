import MapView, { Marker, Polyline } from 'react-native-maps';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Button, TouchableOpacity, StyleSheet, Modal, Text, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import api from '../api';

export default function ConductorHomeScreen() {
  const [points, setPoints] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [location, setLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [routeName, setRouteName] = useState('');
  const [showScheduleTripPrompt, setShowScheduleTripPrompt] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState('date');
  const [startTime, setStartTime] = useState(new Date());

  const [shouldFollow, setShouldFollow] = useState(true); // controla el seguimiento
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [savedRouteId, setSavedRouteId] = useState(null);
  const [coordinates, setCoordinates] = useState([])

  const mapRef = useRef(null);

  const openPicker = (mode) => {
    setDateMode(mode);
    setShowDatePicker(true);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        loc => {
          const coords = loc.coords;
          setLocation(coords);

          if (shouldFollow && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      );
    })();
  }, [shouldFollow]);

  const getOptimizedRoute = async () => {
    if (points.length < 2) {
      alert('Se necesitan al menos dos puntos');
      return;
    }

    const coords = points.map(p => [p.latitude, p.longitude]);
    setCoordinates(coords);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/api/routes/full-route/',
        { coordinates: coords },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      const geoJson = response.data;
      const lineCoords = geoJson.geometry.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));

      setOptimizedRoute(lineCoords);
      setDrawing(false);

    } catch (error) {
      console.error('Error obteniendo ruta:', error.response?.data || error.message);
      alert('No se pudo calcular la ruta');
    }
  };

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

          const verifiedVehicles = response.data.filter(v => v.is_verified === true);
          setUserVehicles(verifiedVehicles);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchVehicles();
    }, [])
  );

  const handleMapTouch = () => {
    setShouldFollow(false); // cuando el usuario toca el mapa, desactiva seguimiento
  };

  const handleFollowMe = () => {
    setShouldFollow(true); // botón para volver a seguir tu ubicación

  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}

        onPanDrag={handleMapTouch}
        onPress={(e) => {
          handleMapTouch();
          if (drawing) {
            const newPoint = e.nativeEvent.coordinate;
            setPoints(prev => [...prev, newPoint]);
          }
        }}

        initialRegion={{
          latitude: location?.latitude || 19.4326,
          longitude: location?.longitude || -99.1332,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {points.map((point, idx) => (
          <Marker
            key={idx}
            coordinate={point}
            onPress={(e) => {

              e.stopPropagation && e.stopPropagation();
              setPoints(points.filter((_, i) => i !== idx));

            }}
          />
        ))}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            image={require('../assets/my-location.png')}
          />
        )}
        {optimizedRoute.length > 1 && (
          <Polyline coordinates={optimizedRoute} strokeColor="#00BFFF" strokeWidth={4} />
        )}
      </MapView>


      <View style={styles.buttonContainer}>
        <Button
          title="Marcar ruta"
          onPress={() => {
            setDrawing(true);
            setPoints([]);
            setOptimizedRoute([]);
          }}
        />
        <Button
          title="Visualizar ruta"
          onPress={getOptimizedRoute}
          disabled={!drawing || points.length < 2}
        />

        <Button
          title="Guardar ruta"
          onPress={() => setShowRouteForm(true)}
          disabled={optimizedRoute.length === 0}
        />
      </View>

      <TouchableOpacity style={styles.circleButton} onPress={handleFollowMe}>
        <Ionicons name="compass" size={24} color="#1A0A1F" />
      </TouchableOpacity>

      <Modal
        visible={showRouteForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRouteForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guardar ruta</Text>

            <Text style={styles.label}>Nombre de la ruta:</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Ej: Ruta de A a B a ..."
              value={routeName}
              onChangeText={setRouteName}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button title="Cancelar" color="grey" onPress={() => setShowRouteForm(false)} />
              <Button
                title="Guardar"
                onPress={async () => {
                  if (!routeName.trim()) {
                    alert('Por favor ingresa un nombre para la ruta');
                    return;
                  }

                  if (optimizedRoute.length < 2) {
                    alert('No hay una ruta válida para guardar');
                    return;
                  }

                  try {
                    const token = await AsyncStorage.getItem('token');

                    const response = await api.post(
                      '/api/routes/',
                      {
                        name: routeName,
                        coordinates,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    const routeId = response.data.id;

                    console.log('Ruta guardada con ID:', routeId);

                    setSavedRouteId(routeId);

                    alert('Ruta guardada con éxito');
                    setRouteName('');
                    setShowRouteForm(false);
                    setShowScheduleTripPrompt(true);
                  } catch (err) {
                    console.error('Error guardando ruta:', err.response?.data || err.message);
                    alert('Error al guardar la ruta');
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showScheduleTripPrompt}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowScheduleTripPrompt(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Deseas programar un viaje con esta ruta?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button title="No, gracias" onPress={() => {
                setShowScheduleTripPrompt(false);
                setPoints([]);
                setOptimizedRoute([]);
              }} />
              <Button title="Sí, programar viaje" onPress={() => {
                setShowScheduleTripPrompt(false);
                setShowForm(true);
              }} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del viaje</Text>

            <Text style={styles.label}>Fecha de inicio:</Text>
            <TouchableOpacity onPress={() => openPicker('date')} style={styles.inputBox}>
              <Text>{startTime.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Hora de inicio:</Text>
            <TouchableOpacity onPress={() => openPicker('time')} style={styles.inputBox}>
              <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={startTime}
                mode={dateMode}
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setStartTime(selectedDate);
                  setShowDatePicker(false);
                }}
                textColor='#000'
              />
            )}

            <Text style={styles.label}>Vehículo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVehicle}
                onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
              >
                <Picker.Item label="Seleccione un vehículo" value={null} color='#000' />
                {userVehicles.map((v) => (
                  <Picker.Item key={v.id} label={v.plate} value={v.id} color='#000' />
                ))}
              </Picker>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button title="Cancelar" color="grey" onPress={() => {
                setShowForm(false)
                setPoints([]);
                setOptimizedRoute([]);
              }} />
              <Button
                title="Guardar viaje"
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem('token');

                    if (!savedRouteId || !selectedVehicle || !startTime) {
                      alert('Faltan datos para guardar el viaje.');
                      return;
                    }

                    const payload = {
                      date: startTime.toISOString(),
                      route: savedRouteId,
                      vehicle: selectedVehicle
                    };

                    const response = await api.post('/api/trips/', payload, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    alert('Viaje programado exitosamente');
                    setShowForm(false);
                    setPoints([]);
                    setOptimizedRoute([]);

                    console.log('Viaje creado:', response.data);
                  } catch (err) {
                    console.error('Error guardando viaje:', err.response?.data || err.message);
                    alert('Error al guardar el viaje');
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({

  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80, // o 60 según el dispositivo
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
    color: '#000'
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
  }
});
