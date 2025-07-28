import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import ConductorHomeScreen from '../screens/ConductorHomeScreen';
import MyVehiclesScreen from '../screens/MyVehiclesScreen';
import TripsScreen from '../screens/TripsScreen';
import { logout } from '../utils/authHelper';
import RegisterVehicleScreen from '../screens/RegisterVehicleScreen';

const Drawer = createDrawerNavigator();

export default function ConductorNavigator({ setUserType }) {
  function CustomDrawerContent(props) {

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Cerrar sesión"
          labelStyle={{ color: 'red' }}
          icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
          onPress={() => logout(setUserType)}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Inicio - Rutas"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerActiveTintColor: '#007bff',
        drawerLabelStyle: { fontSize: 16 },
        drawerIcon: ({ color, size }) => {
          const icons = {
            'Inicio - Rutas': 'map-outline',
            'Mis Vehiculos': 'car-sport-outline',
            'Mis Viajes': 'navigate',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Inicio - Rutas" component={ConductorHomeScreen} />
      <Drawer.Screen name="Mis Vehiculos" component={MyVehiclesScreen} />
      <Drawer.Screen name="Mis Viajes" component={TripsScreen} />
      <Drawer.Screen
        name="Registrar Vehiculo"
        component={RegisterVehicleScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}
