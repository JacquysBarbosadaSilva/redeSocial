import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { getApp } from "firebase/app";

const screenWidth = Dimensions.get("window").width;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const app = getApp();
      const db = getFirestore(app);
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = await Promise.all(
        snapshot.docs.map(async (docPost) => {
          const post = docPost.data();
          const userRef = doc(db, "usuarios", post.usuarioId);
          const userSnap = await getDoc(userRef);
          const user = userSnap.exists() ? userSnap.data() : {};
          return {
            ...post,
            nome: user.nome || user.displayName || "Usuário",
            photoUrl: user.photoUrl,
          };
        })
      );

      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
        <Text style={styles.author}>{item.nome}</Text>
      </View>

      {item.tipo === "imagem" ? (
        <Image source={{ uri: item.conteudo }} style={styles.postImage} />
      ) : (
        <Text style={styles.postDescription}>{item.conteudo}</Text>
      )}

      {item.descricao && item.tipo === "imagem" ? (
        <Text style={styles.description}>{item.descricao}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Likeê</Text>

      {loading ? (
        <Text style={styles.loadingText}>Carregando posts...</Text>
      ) : posts.length === 0 ? (
        <Text style={styles.noPostsText}>Nenhum post disponível</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingHorizontal: 15,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#53c7db",
    marginBottom: 20,
  },
  loadingText: {
    color: "#aaa",
    textAlign: "center",
  },
  noPostsText: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 30,
  },
  postContainer: {
    borderColor: "#53DBC3",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    marginRight: 10,
  },
  author: {
    color: "#53c7db",
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: screenWidth * 0.9,
    borderRadius: 10,
    marginBottom: 10,
  },
  postText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  postDescription: { // Novo estilo para a descrição do post de texto
    color: "#fff",
    fontSize: 14, // Usando o tamanho da fonte da descrição original
    marginTop: 0, // Removendo a margem superior
    marginBottom: 10,
  },
  description: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 5,
  },
});

export default Posts;