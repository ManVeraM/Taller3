import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph, ActivityIndicator, Button } from 'react-native-paper';

export default function Home() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios.get("http://localhost:5287/Repositories").then(response => {
        console.log(response.data);
        setRepositories(response.data);
        setLoading(false);
      });
    }, []);

    const handlePress = (repoId) => {
      console.log(`Ver commits del repositorio ${repoId}`);
      // Aquí puedes agregar la lógica para navegar a la pantalla de commits
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a la página de inicio</Text>
        <Text style={styles.title}>Repositorios de GitHub</Text>
        {loading && <ActivityIndicator animating={true} />}
        {!loading && repositories.map(repo => (
            <Card key={repo.id} style={styles.card}>
              <Card.Content>
                <Title>{repo.name}</Title>
                <Paragraph>Creado en: {repo.createdAt}</Paragraph>
                <Paragraph>Cantidad de commits: {repo.commitsAmount}</Paragraph>
              </Card.Content>
              <Card.Actions>
              <Button mode="contained" onPress={() => handlePress(repo.id)}>Ver commits</Button>
              </Card.Actions>
            </Card>
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  card: {
    margin: 10,
  },
});