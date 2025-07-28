import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, Modal, TextInput,
    Button, Platform
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api';
import { Ionicons } from '@expo/vector-icons';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@env';

export default function PasajeroHomeScreen() {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState('start'); // 'start' o 'end'

    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedRouteCoords, setSelectedRouteCoords] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchTrips = async () => {
        try {
            const loginResponse = await api.post('/api/login/', {
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
            });

            const admin_token = loginResponse.data.access;
            const config = {
                headers: { Authorization: `Bearer ${admin_token}` }
            };
            const response = await api.get('/api/trips/', config);
            const disponibles = response.data.filter((trip) => trip.status === 'CREATED');

            const enrichedTrips = await Promise.all(
                disponibles.map(async (trip) => {
                    try {
                        const [routeRes, userRes] = await Promise.all([
                            api.get(`/api/routes/${trip.route}/`, config),
                            api.get(`/api/users/${trip.driver}/`, config)
                        ]);

                        return {
                            ...trip,
                            routeName: routeRes.data.name,
                            routeCoords: routeRes.data.coordinates,
                            driverName: `${userRes.data.first_name} ${userRes.data.last_name}`
                        };
                    } catch (err) {
                        console.error('Error enriqueciendo viaje', trip.id, err);
                        return trip;
                    }
                })
            );

            setTrips(enrichedTrips);
            setFilteredTrips(enrichedTrips);
        } catch (error) {
            console.error('Error al obtener los viajes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const applyFilter = async () => {
        try {
            if (startDate && endDate) {
                const after = startDate.toISOString().split('T')[0]; // formato YYYY-MM-DD
                const before = endDate.toISOString().split('T')[0];

                const loginResponse = await api.post('/api/login/', {
                    username: ADMIN_USERNAME,
                    password: ADMIN_PASSWORD,
                });

                const admin_token = loginResponse.data.access;
                const config = {
                    headers: { Authorization: `Bearer ${admin_token}` }
                };

                const tripsResponse = await api.get('/api/trips/', {
                    params: {
                        date_after: after,
                        date_before: before
                    },
                    headers: { Authorization: `Bearer ${admin_token}` }
                });

                const disponibles = tripsResponse.data.filter((trip) => trip.status === 'CREATED');

                const enrichedTrips = await Promise.all(
                    disponibles.map(async (trip) => {
                        try {
                            const [routeRes, userRes] = await Promise.all([
                                api.get(`/api/routes/${trip.route}/`, config),
                                api.get(`/api/users/${trip.driver}/`, config)
                            ]);

                            return {
                                ...trip,
                                routeName: routeRes.data.name,
                                routeCoords: routeRes.data.coordinates,
                                driverName: `${userRes.data.first_name} ${userRes.data.last_name}`
                            };
                        } catch (err) {
                            console.error('Error enriqueciendo viaje', trip.id, err);
                            return trip;
                        }
                    })
                );

                setFilteredTrips(enrichedTrips);
            }
        } catch (error) {
            console.error('Error al filtrar rutas por fecha:', error);
        } finally {
            setShowFilterModal(false);
        }
    };

    const applySearch = () => {
        const search = searchText.toLowerCase();
        const filtered = trips.filter((trip) =>
            trip.routeName?.toLowerCase().includes(search)
        );
        setFilteredTrips(filtered);
        setShowSearchModal(false);
        setSearchText('');
    };

    const renderRuta = ({ item }) => (
        <View style={styles.rutaCard}>
            <Text style={styles.rutaTitle}>🗺️ {item.routeName}</Text>
            <Text style={styles.text}>👨‍✈️ Conductor: {item.driverName}</Text>
            <Text style={styles.dateText}>📅 Fecha: {new Date(item.date).toLocaleString()}</Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#6200ee',
                    width: 30,
                    height: 30,
                    borderRadius: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    flexDirection: 'row'
                }}
                onPress={() => {
                    const coords = item.routeCoords.map(([lon, lat]) => ({
                        latitude: lat,
                        longitude: lon
                      }));
                    setSelectedRouteCoords(coords);
                    setShowMapModal(true);
                }}
            >
                <Ionicons name="map-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            {loading ? (
                <ActivityIndicator size="large" color="#6200ee" />
            ) : (
                <FlatList
                    data={filteredTrips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderRuta}
                    ListEmptyComponent={<Text style={styles.text}>No hay rutas disponibles</Text>}
                />
            )}

            <Modal visible={showMapModal} animationType="slide">
                <View style={{ flex: 1 }}>
                    {selectedRouteCoords.length > 0 && (
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: selectedRouteCoords[0].latitude,
                                longitude: selectedRouteCoords[0].longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Polyline
                                coordinates={selectedRouteCoords}
                                strokeColor="#007bff"
                                strokeWidth={4}
                            />
                        </MapView>
                    )}

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 40,
                            right: 20,
                            backgroundColor: '#ff4444',
                            padding: 10,
                            borderRadius: 20,
                            zIndex: 10
                        }}
                        onPress={() => setShowMapModal(false)}
                    >
                        <Text style={{ color: 'white' }}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.fab]}
                    onPress={() => setShowSearchModal(true)}
                >
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={fetchTrips}
                >
                    <Ionicons name="reload-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="filter" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

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

            <Modal visible={showFilterModal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Filtrar por fechas</Text>

                        <TouchableOpacity onPress={() => { setShowDatePicker(true); setDatePickerMode('start'); }}>
                            <Text style={styles.buttonText}>
                                {startDate ? `Desde: ${startDate.toLocaleDateString()}` : 'Seleccionar fecha de inicio'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setShowDatePicker(true); setDatePickerMode('end'); }}>
                            <Text style={styles.buttonText}>
                                {endDate ? `Hasta: ${endDate.toLocaleDateString()}` : 'Seleccionar fecha final'}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        if (datePickerMode === 'start') {
                                            setStartDate(selectedDate);
                                        } else {
                                            setEndDate(selectedDate);
                                        }
                                    }
                                    setShowDatePicker(false);
                                }}
                                textColor='#000'
                            />
                        )}

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
    rutaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
        color: '#000',
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
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        alignItems: 'center',
    },
    fab: {
        backgroundColor: '#6200ee',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        marginBottom: 20,
    },
});
