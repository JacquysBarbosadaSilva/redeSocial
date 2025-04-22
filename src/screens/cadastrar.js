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
import { getApp } from "firebase/app";
import s3 from "../../awsConfig";

const S3_BUCKET = "bucket-storage-senai-10";

const Cadastrar = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [inputFocus, setInputFocus] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
    if (!email || !password || !nome) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const auth = getAuth(getApp());
    const firestore = getFirestore(getApp());

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let photoUrl = null;

      if (imageUri) {
        const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
        const filePath = `perfil_imagem/${user.uid}/${filename}`;
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const uploadParams = {
          Bucket: S3_BUCKET,
          Key: filePath,
          Body: blob,
          ContentType: "image/jpeg",
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        photoUrl = uploadResult.Location;
      }

      await setDoc(doc(firestore, "usuarios", user.uid), {
        uid: user.uid,
        email: email,
        nome: nome,
        photoUrl: photoUrl,
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate("RealizarLogin");
    } catch (error) {
      let mensagemErro = "Erro ao cadastrar usuário: ";

      if (error.code === "auth/email-already-in-use") {
        mensagemErro = "Este e-mail já está em uso.";
      } else if (error.code === "auth/invalid-email") {
        mensagemErro = "E-mail inválido.";
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
              style={[styles.input, inputFocus === "nome" && styles.inputFocused]}
              placeholder="Nome"
              placeholderTextColor="#ccc"
              value={nome}
              onChangeText={setNome}
              onFocus={() => setInputFocus("nome")}
              onBlur={() => setInputFocus(null)}
              underlineColorAndroid="transparent"
            />

            <TextInput
              style={[styles.input, inputFocus === "email" && styles.inputFocused]}
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
              style={[styles.input, inputFocus === "password" && styles.inputFocused]}
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
              onPress={() => navigation.navigate("RealizarLogin")}
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
    width: "80%",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
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
