import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";

// Impede que a splash screen suma automaticamente (isso pode ser redundante aqui dependendo da sua configuração)
SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const navigateToLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
      navigation.replace("Login");
    };

    navigateToLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/logo.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6153DB",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 450,
    height: 450,
    resizeMode: "contain",
  },
});

export default SplashScreenComponent;