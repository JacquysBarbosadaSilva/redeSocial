import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../../firebaseConfig"; // ajuste o caminho conforme necessário
import { s3 } from "../../awsConfig";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const S3_BUCKET = "likee-bucket";

const Cadastrar = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [inputFocus, setInputFocus] = useState(null);

  // Função para selecionar imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Salva o URI da imagem selecionada
    }
  };

  // Função para registrar o usuário
  const handleCadastro = async () => {
    if (!email || !password || !nome) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const auth = getAuth(app);
    const firestore = getFirestore(app);

    try {
      // Criação do usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let photoUrl = null; // Variável para armazenar a URL da foto

      if (imageUri) {
        const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
        const filePath = `perfil_imagem/${user.uid}/${filename}`;

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: filePath,
          Body: blob,
          ContentType: "image/jpeg",
        });

        await s3.send(command);
        photoUrl = `https://${S3_BUCKET}.s3.sa-east-1.amazonaws.com/${filePath}`;
      }

      // Salvar dados do usuário no Firestore
      await setDoc(doc(firestore, "usuarios", user.uid), {
        uid: user.uid,
        email: email,
        nome: nome,
        photoUrl: photoUrl, // Salva a URL da foto
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.replace("Tabs"); // Navega para a tela de login
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      let mensagemErro = "Erro ao cadastrar usuário: ";

      // Trata erros específicos do Firebase
      if (error.code === "auth/email-already-in-use") {
        mensagemErro =
          "Este e-mail já está em uso. Por favor, faça login ou utilize outro e-mail.";
      } else if (error.code === "auth/invalid-email") {
        mensagemErro = "E-mail inválido. Verifique e tente novamente.";
      } else if (error.code === "auth/weak-password") {
        mensagemErro = "A senha deve ter pelo menos 6 caracteres.";
      } else {
        mensagemErro += error.message;
      }

      Alert.alert("Erro", mensagemErro);
    }
  };

  return (
    <View style={styles.background}>
      <LinearGradient
        colors={["#6153DB", "#6153DB", "#6153DB", "#53DBC3"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.logoText}>Cadastro</Text>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePickerText}>Selecionar Foto</Text>
            )}
          </TouchableOpacity>

          <View style={styles.container}>
            <TextInput
              style={[
                styles.input,
                inputFocus === "nome" && styles.inputFocused,
              ]}
              placeholder="Nome"
              placeholderTextColor="#ccc"
              value={nome}
              onChangeText={setNome}
              onFocus={() => setInputFocus("nome")}
              onBlur={() => setInputFocus(null)}
              underlineColorAndroid="transparent"
            />

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

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <Text
              onPress={() => navigation.navigate("Login")}
              style={styles.loginLink}
            >
              Já tem uma conta? Faça login
            </Text>
          </View>
        </ScrollView>
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
  scroll: {
    width: "100%",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#53c7db",
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePickerText: {
    color: "#666",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "300px",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#53DBC3",
    color: "#fff",
    backgroundColor: "transparent",
  },
  inputFocused: {
    borderColor: "#53c7db",
    borderBottomWidth: 2,
  },
  button: {
    backgroundColor: "#53c7db",
    paddingVertical: 12,
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});

export default Cadastrar;
