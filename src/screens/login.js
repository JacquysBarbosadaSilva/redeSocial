// Jacquys Barbosa Silva

import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,

} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import app from "../../firebaseConfig";

const RealizarLogin = ({ navigation }) => {
  const img =
    "https://img.freepik.com/vetores-gratis/vetor-azul-escuro-do-fundo-da-historia-do-facebook-de-memphis_53876-162121.jpg?t=st=1743519404~exp=1743523004~hmac=0956c84fe373416ac4719a6be4a53a27d5f2f68a70c952c7f34477f065057055&w=740";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tentarLogar = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("PaginaPrincipal");
      })
      .catch((error) => {
        console.error("Login Falhou", error);
      });
  };

  return (
    <ImageBackground source={{ uri: img }} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={tentarLogar}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text 
            onPress={() => navigation.navigate("Cadastrar")} 
            style={{ color: "#0C242E",fontWeight: 'bold'}} >Cadastrar-se
          </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#0C242E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RealizarLogin;
