import MapView, { Marker, Polyline } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [points, setPoints] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [location, setLocation] = useState(null);

  const [shouldFollow, setShouldFollow] = useState(true); // controla el seguimiento

  const mapRef = useRef(null);

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
        onPress={handleMapTouch}
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
        {points.length > 1 && (
          <Polyline coordinates={points} strokeColor="#340378" strokeWidth={4} />
        )}
      </MapView>

      <Button title="Iniciar ruta" onPress={() => setDrawing(true)} />
      <Button title="Guardar ruta" onPress={() => {
        setDrawing(false);
        console.log('Ruta guardada:', points);
      }} disabled={!drawing || points.length < 2} />

      <TouchableOpacity style={styles.circleButton} onPress={handleFollowMe}>
       <Ionicons name="compass" size={24} color="#1A0A1F" />
      </TouchableOpacity>
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
});
