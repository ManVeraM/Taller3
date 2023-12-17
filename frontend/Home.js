import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Home() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {  
        axios.get('https://api.github.com/users/ManVeraM/repos')
        .then(response => {
            setRepositories(response.data);
        });
    }
    , []);


    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a la página de inicio</Text>
        <Text style={styles.title}>Mis repositorios de GitHub</Text>
        {repositories.map(repo => <Text key={repo.id}>{repo.name}</Text>)}

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
});