import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Startup() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLoginPress = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const handleRegisterPress = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
  };

  const handleCancelPress = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Bienvenido a mobilehub" titleStyle={styles.centeredTitle} />
        <Card.Content>
          <Image source={require('./assets/mobilehubLogo.png')} style={styles.logo} />
          {showLoginForm ? (
            <>
              <LoginForm />
              <Button mode="outlined" style={styles.button} onPress={handleCancelPress}>
                Cancelar
              </Button>
            </>
          ) : showRegisterForm ? (
            <>
              <RegisterForm />
              <Button mode="outlined" style={styles.button} onPress={handleCancelPress}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button mode="contained" style={styles.button} onPress={handleLoginPress}>
                Iniciar sesión
              </Button>
              <Button mode="outlined" style={styles.button} onPress={handleRegisterPress}>
                Registrarse
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3', // Color gris pastel
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF', // Color blanco
  },
  button: {
    marginTop: 10,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});