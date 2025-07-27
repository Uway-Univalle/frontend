import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (setUserType) => {
  try {
    await AsyncStorage.clear()
    setUserType(null);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
