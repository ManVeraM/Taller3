import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import { DataTable, ActivityIndicator } from 'react-native-paper';

export default function CommitsDisplay({ repositoryName }) {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      axios.get(`http://localhost:5287/Repositories/commits/${repositoryName}`, {
        }).then(response => {
        console.log(response.data);
        setCommits(response.data);
        setLoading(false);
      });
    }, [repositoryName]);

    return (
        <View style={styles.container}>
        {loading && <ActivityIndicator animating={true} />}
        {!loading && (
        <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>Autor</DataTable.Title>
              <DataTable.Title>Fecha</DataTable.Title>
              <DataTable.Title>Mensaje</DataTable.Title>
            </DataTable.Header>

            {commits.map((commit, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{commit.author}</DataTable.Cell>
                <DataTable.Cell>{commit.date}</DataTable.Cell>
                <DataTable.Cell>{commit.message}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}
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
    table: {
      marginBottom: 20, // Ajusta este valor a lo que necesites
    },
  });