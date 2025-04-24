// screens/editarPerfil.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditarPerfil = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Edição de Perfil</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000',
  },
  text: {
    color: '#53DBC3', fontSize: 20,
  },
});

export default EditarPerfil;
