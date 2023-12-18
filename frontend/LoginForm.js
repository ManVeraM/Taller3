import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    // Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    const user = {
      Email: email,
      Password: password,
    };
    console.log(user)

    // Lógica de inicio de sesión
    axios.post('http://localhost:5287/api/Authentication/login', user)
      .then(response => {
        if (response.data) {
          // Inicio de sesión exitoso
          console.log('Inicio de sesión exitoso:', response.data);
        } else {
          // Inicio de sesión fallido
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