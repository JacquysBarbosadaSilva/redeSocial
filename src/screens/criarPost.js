import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { uploadImageToS3 } from "../../awsConfig";

const CriarPost = ({ navigation }) => {
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const criarPost = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      let imageUrl = null;

      if (imagem) {
        imageUrl = await uploadImageToS3(imagem, "imagens");
      }

      await addDoc(collection(firestore, "imagens"), {
        autorId: user.uid,
        descricao,
        imageUrl,
        criadoEm: Timestamp.now(),
      });

      Alert.alert("Sucesso", "Post criado com sucesso!");
      setDescricao("");
      setImagem(null);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao criar post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem..."
        placeholderTextColor="#aaa"
        value={descricao}
        onChangeText={setDescricao}
      />

      {imagem && <Image source={{ uri: imagem }} style={styles.image} />}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.botao} onPress={escolherImagem}>
          <Text style={styles.textoBotao}>Escolher Imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoPublicar} onPress={criarPost}>
          <Text style={styles.textoBotao}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CriarPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flex: 1,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  botaoPublicar: {
    flex: 1,
    backgroundColor: "#53DBC3",
    padding: 15,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
});
