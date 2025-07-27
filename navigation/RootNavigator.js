import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import ConductorNavigator from './ConductorNavigator';
import PasajeroNavigator from './PasajeroNavigator';
import { USER_TYPES } from '../constants';

export default function RootNavigator() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const user_type = await AsyncStorage.getItem('user_type');
      console.log(user_type);
      if (token && user_type) {
        setUserType(user_type);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if (!userType) return <AuthNavigator setUserType={setUserType} />;
  if (userType === USER_TYPES.DRIVER.toString()) return <ConductorNavigator setUserType={setUserType} />;
  if (userType === USER_TYPES.PASSENGER.toString()) return <PasajeroNavigator setUserType={setUserType} />;
}
