import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  const handleLogin = () => {

    // Validations
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    const user = {
      Email: email,
      Password: password,
    };
    console.log(user)

    // Login function
    axios.post('http://localhost:5287/api/Authentication/login', user)
    .then(async response => {
        if (response.data) {
          alert('Registro exitoso!');
          // successful login and token save
          await AsyncStorage.setItem('userToken', response.data.token);
          console.log(response.data.token);

             

          navigation.navigate('Home');
        } else {
          // failed login
          Alert.alert('Error', 'Credenciales inválidas. Por favor, inténtelo de nuevo.');
        }
      })
      .catch(error => {
        console.error('Error en inicio de sesión:', error);
        Alert.alert('Error', 'Ocurrió un error en el inicio de sesión. Por favor, inténtelo de nuevo.');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleLogin}>
        Iniciar sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
});