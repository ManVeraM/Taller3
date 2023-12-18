import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import axios from 'axios';

export default function EditForm() {
  const [email, setEmail] = useState('');

  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    birthYear: '',
    fullName: '',
    email: '',
  });



  const validateBirthYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
  };

  const validateFullName = (name) => {
    return name.length >= 10 && name.length <= 150;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w\.-]+@ucn\.cl$|^[\w\.-]+@alumnos\.ucn\.cl$|^[\w\.-]+@disc\.ucn\.cl$|^[\w\.-]+@ce\.ucn\.cl$/;
    return emailRegex.test(email);
  };

  const handleEdit = () => {
    // Limpiar mensajes de error
    setErrorMessages({
      rut: '',
      birthYear: '',
      fullName: '',
      email: '',
    });

    // Validaciones
    let isValid = true;

    if (!validateRut(rut)) {
      setErrorMessages((prevErrors) => ({ ...prevErrors, rut: 'RUT no válido. Ingrese un RUT válido.' }));
      isValid = false;
    }

    if (!validateBirthYear(parseInt(birthYear, 10))) {
      setErrorMessages((prevErrors) => ({ ...prevErrors, birthYear: 'Año de nacimiento no válido. Ingrese un año entre 1900 y el año actual.' }));
      isValid = false;
    }

    if (!validateFullName(fullName)) {
      setErrorMessages((prevErrors) => ({ ...prevErrors, fullName: 'Nombre completo no válido. Debe tener entre 10 y 150 caracteres.' }));
      isValid = false;
    }

    if (!validateEmail(email)) {
      setErrorMessages((prevErrors) => ({ ...prevErrors, email: 'Correo electrónico no válido o no pertenece al dominio UCN.' }));
      isValid = false;
    }

    // Resto de la lógica de registro
    if (isValid) {
      const user = {
        fullName: fullName,
        email: email,
        rut: rut,
        YearOfBirth: birthYear,
        password: rut.replace(/[^0-9kK]/g, '')
      };

      axios.post('http://localhost:5287/api/Users', user)
        .then(response => {
          if (response.data) {
            console.log('Registro exitoso: ', response.data);
            alert('Registro exitoso!');
            navigation.navigate('Home');
          } else {
            alert('Error al registrarse: ' + response.data.message);
          }
        })
        .catch(error => {
          console.error('Error al registrarse: ', error);
        });
    }
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
      <HelperText type="error" visible={!!errorMessages.email}>
        {errorMessages.email}
      </HelperText>
      <TextInput
        label="RUT"
        value={rut}
        onChangeText={setRut}
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!!errorMessages.rut}>
        {errorMessages.rut}
      </HelperText>
      <TextInput
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!!errorMessages.fullName}>
        {errorMessages.fullName}
      </HelperText>
      <TextInput
        label="Año de nacimiento"
        value={birthYear}
        onChangeText={setBirthYear}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <HelperText type="error" visible={!!errorMessages.birthYear}>
        {errorMessages.birthYear}
      </HelperText>
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