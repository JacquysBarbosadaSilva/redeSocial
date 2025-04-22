import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const RealizarLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputFocus, setInputFocus] = useState(null);

  const tentarLogar = () => {
    console.log("Tentando logar com:", email, password);
  };

  return (
    <View style={styles.background}>
      <LinearGradient
        colors={["#6153DB", "#000"]}
        style={styles.gradient}
      >
        <Text style={styles.logoText}>Likeê</Text>

        <View style={styles.container}>
          <TextInput
            style={[
              styles.input,
              inputFocus === "email" && styles.inputFocused,
            ]}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setInputFocus("email")}
            onBlur={() => setInputFocus(null)}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={[
              styles.input,
              inputFocus === "password" && styles.inputFocused,
            ]}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setInputFocus("password")}
            onBlur={() => setInputFocus(null)}
            underlineColorAndroid="transparent"
          />


          <View style={styles.row}>
            <Pressable
              onPress={tentarLogar}
              style={{ flex: 1, marginRight: 5 }}
            >
              <LinearGradient
                colors={["#53c7db", "#5371db"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Cadastrar")}
              style={[styles.button, styles.registerButton]}
            >
              <Text style={[styles.buttonText, styles.registerText]}>
                Cadastrar-se
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#53c7db",
  },
  container: {
    width: "80%",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#4887be",
    color: "#fff",
    backgroundColor: "transparent",
  },
  inputFocused: {
    borderColor: "#53c7db",
    borderBottomWidth: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#53c7db",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#53c7db",
  },
  registerText: {
    color: "#53c7db",
  },
});

export default RealizarLogin;
