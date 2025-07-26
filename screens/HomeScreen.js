import MapView, { Marker, Polyline } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { View, Button } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [points, setPoints] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // centrar la cámara a la ubicación actual una vez se mueva
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);

      // Monitorear ubicación en tiempo real 
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 },
        loc => setLocation(loc.coords)
      );
    })();
  }, []);

  const handleMapPress = (e) => {
    if (drawing) {
      setPoints([...points, e.nativeEvent.coordinate]);
    }
  };

  const handleMarkerPress = (idx) => {
    setPoints(points.filter((_, i) => i !== idx));
  };

  const handleStartRoute = () => setDrawing(true);

  const handleSaveRoute = () => {
    setDrawing(false);
    console.log('Ruta guardada:', points);
    // Aquí puedes guardar la ruta en tu backend o almacenamiento local
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onPress={handleMapPress}
        showsUserLocation={true}
        followsUserLocation={false} 
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
              e.stopPropagation && e.stopPropagation(); // Evita que se active el evento del mapa
              handleMarkerPress(idx);
            }}
          />
        ))}
        {points.length > 1 && (
          <Polyline coordinates={points} strokeColor="#340378" strokeWidth={4} />
        )}
      </MapView>
      <Button title="Iniciar ruta" onPress={handleStartRoute} />
      <Button title="Guardar ruta" onPress={handleSaveRoute} disabled={!drawing || points.length < 2} />
    </View>
  );
}
