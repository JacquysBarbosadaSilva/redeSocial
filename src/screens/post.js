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
} from "firebase/firestore";
import app from "../../firebaseConfig";

const screenWidth = Dimensions.get("window").width;

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore(app);
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => doc.data());
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.author}>{item.usuario}</Text>
      {item.tipo === "imagem" ? (
        <Image source={{ uri: item.conteudo }} style={styles.postImage} />
      ) : (
        <Text style={styles.postText}>{item.conteudo}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Likeê</Text>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
  author: {
    color: "#53c7db",
    fontWeight: "bold",
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: screenWidth * 0.9,
    borderRadius: 10,
  },
  postText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Posts;
