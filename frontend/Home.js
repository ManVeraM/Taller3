import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph, ActivityIndicator, Button } from 'react-native-paper';
import { Modal } from 'react-native';
import CommitsDisplay from './CommitsDisplay'; // Asegúrate de que la ruta sea correcta

export default function Home() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState(null); 

    useEffect(() => {
      axios.get("http://localhost:5287/Repositories").then(response => {
        console.log(response.data);
        setRepositories(response.data);
        setLoading(false);
      });
    }, []);



    const handlePress = (repositoryName) => {
      setSelectedRepo(repositoryName);
      setModalVisible(true);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a la página de inicio</Text>
        <Text style={styles.title}>Repositorios de GitHub</Text>
        {loading && <ActivityIndicator animating={true} />}
        {!loading && repositories.map(repo => (
            <Card key={repo.name} style={styles.card}>
              <Card.Content>
                <Title>{repo.name}</Title>
                <Paragraph>Creado en: {repo.createdAt}</Paragraph>
                <Paragraph>Cantidad de commits: {repo.commitsAmount}</Paragraph>
              </Card.Content>
              <Card.Actions>
              <Button mode="contained" onPress={() => handlePress(repo.name)}>Ver commits</Button>
              </Card.Actions>
            </Card>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CommitsDisplay repositoryName={selectedRepo} />
              <Button
                mode="contained"
                onPress={() => setModalVisible(!modalVisible)}
              >
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});