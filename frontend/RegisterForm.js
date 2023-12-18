import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import axios from 'axios';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    rut: '',
    birthYear: '',
    fullName: '',
    email: '',
  });

  const validateRut = (rut) => {
    //Rut validation function
    const cleanRut = rut.replace(/[^0-9kK]/g, ''); 
    const rutDigits = cleanRut.slice(0, -1);
    const rutVerifier = cleanRut.slice(-1).toLowerCase();

    if (!/^\d+$/.test(rutDigits) || rutDigits.length < 7) {
      return false;
    }

    let sum = 0;
    let multiplier = 2;

    for (let i = rutDigits.length - 1; i >= 0; i--) {
      sum += parseInt(rutDigits.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;
    const calculatedVerifier = remainder === 0 ? 0 : 11 - remainder;

    return (
      (calculatedVerifier === 10 && rutVerifier === 'k') ||
      (calculatedVerifier !== 10 && calculatedVerifier.toString() === rutVerifier)
    );
  };

  const validateBirthYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
  };

  const validateFullName = (name) => {
    return name.length >= 10 && name.length <= 150;
  };
// mail validations
  const validateEmail = (email) => {
    const emailRegex = /^[\w\.-]+@ucn\.cl$|^[\w\.-]+@alumnos\.ucn\.cl$|^[\w\.-]+@disc\.ucn\.cl$|^[\w\.-]+@ce\.ucn\.cl$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    // clears error messages
    setErrorMessages({
      rut: '',
      birthYear: '',
      fullName: '',
      email: '',
    });

    // validations
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
