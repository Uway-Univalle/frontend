import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import ConductorHomeScreen from '../screens/ConductorHomeScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import TripsScreen from '../screens/TripsScreen';
import { logout } from '../utils/authHelper';

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
            'Inicio': 'map-outline',
            'Mis Vehículos': 'car',
            'Mis Viajes': 'navigate',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Inicio - Rutas" component={ConductorHomeScreen} />
      <Drawer.Screen name="Mis Vehículos" component={VehiclesScreen} />
      <Drawer.Screen name="Mis Viajes" component={TripsScreen} />
    </Drawer.Navigator>
  );
}
