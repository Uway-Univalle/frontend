import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import PasajeroHomeScreen from '../screens/PasajeroHomeScreen';
import { logout } from '../utils/authHelper';

const Drawer = createDrawerNavigator();

export default function PasajeroNavigator({ setUserType }) {

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
        <Drawer.Navigator initialRouteName="Inicio - Viajes"
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Inicio - Viajes" component={PasajeroHomeScreen} />
        </Drawer.Navigator>
    );
}
