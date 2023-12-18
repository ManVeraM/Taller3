import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './AppNavigator'; // Ajusta la ruta según tu estructura de archivos
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Recupera el token almacenado en AsyncStorage al cargar la aplicación
    const retrieveToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error al recuperar el token:', error);
      }
    };

    retrieveToken();
  }, []); // El segundo argumento vacío [] asegura que este efecto se ejecute solo una vez al cargar la aplicación

  return (
    <NavigationContainer>
      <AppNavigator token={token} />
    </NavigationContainer>
  );
}