import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function RegisterForm() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const handleRegister = () => {
    axios.post('http://localhost:5287/', {
      fullName: fullName,
      email: email,
      rut: rut,
      birthYear: birthYear
    })
    .then(response => {
      // Manejar la respuesta del servidor
      if (response.data.success) {
        alert('Registro exitoso!');
      } else {
        alert('Error al registrarse: ' + response.data.message);
      }
    })
    .catch(error => {
      // Manejar el error
      console.error('Error al registrarse: ', error);
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
        label="RUT"
        value={rut}
        onChangeText={setRut}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Año de nacimiento"
        value={birthYear}
        onChangeText={setBirthYear}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <Button mode="contained" onPress={handleRegister}>
        Registrarse
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