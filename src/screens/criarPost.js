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
import s3 from "../../awsConfig";
import { uploadImageToS3 } from "../../awsConfig";

const CriarPost = ({ navigation }) => {
  const S3_BUCKET = "likee-bucket";

  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [tipo, setTipo] = useState("texto");

  const auth = getAuth();
  const firestore = getFirestore();

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
      let conteudo = descricao;
      let imageUrl = null;

      if (tipo === "imagem") {
        if (!imagem || !descricao.trim()) {
          Alert.alert("Atenção", "Selecione uma imagem e escreva uma descrição.");
          return;
        }

        const filename = imagem.substring(imagem.lastIndexOf("/") + 1);
        const filePath = `posts-imagens/${user.uid}/${filename}`;

        const response = await fetch(imagem);
        const blob = await response.blob();

        const uploadParams = {
          Bucket: S3_BUCKET, 
          Key: filePath,
          Body: blob,
          ContentType: "image/jpeg",
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        imageUrl = uploadResult.Location;
        conteudo = imageUrl; // O conteúdo do post de imagem será a URL da imagem
      } else {
        if (!descricao.trim()) {
          Alert.alert("Atenção", "Digite o conteúdo do post.");
          return;
        }
      }

      await addDoc(collection(firestore, "posts"), {
        usuarioId: user.uid,
        tipo,
        conteudo, // Será a URL da imagem ou o texto do post
        descricao,
        createdAt: Timestamp.now(),
        photoUrl: imageUrl || null, // Salva a URL da imagem, se houver
      });

      Alert.alert("Sucesso", "Post criado com sucesso!");
      setDescricao("");
      setImagem(null);
      setTipo("texto");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao criar post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de post</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[
            styles.tipoBotao,
            tipo === "texto" && styles.tipoSelecionado,
          ]}
          onPress={() => setTipo("texto")}
        >
          <Text style={styles.tipoTexto}>Texto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tipoBotao,
            tipo === "imagem" && styles.tipoSelecionado,
          ]}
          onPress={() => setTipo("imagem")}
        >
          <Text style={styles.tipoTexto}>Imagem</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {tipo === "imagem" ? "Descrição da imagem" : "Texto do post"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui..."
        placeholderTextColor="#aaa"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {tipo === "imagem" && (
        <>
          <TouchableOpacity style={styles.botao} onPress={escolherImagem}>
            <Text style={styles.textoBotao}>Escolher Imagem</Text>
          </TouchableOpacity>

          {imagem && <Image source={{ uri: imagem }} style={styles.image} />}
        </>
      )}

      <TouchableOpacity style={styles.botaoPublicar} onPress={criarPost}>
        <Text style={styles.textoBotao}>Publicar</Text>
      </TouchableOpacity>
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
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tipoBotao: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1a1a1a",
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  tipoSelecionado: {
    backgroundColor: "#53DBC3",
    borderColor: "#53DBC3",
  },
  tipoTexto: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  botaoPublicar: {
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
