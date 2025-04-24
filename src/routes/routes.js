import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login";
import Cadastrar from "../screens/cadastrar";
import Post from "../screens/post";
import CriarPost from "../screens/criarPost";
import EditarPerfil from "../screens/editarPerfil";
import SplashScreenComponent from "../screens/splashScreen"; // Importe o componente SplashScreen

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsNavigator({ navigation }) {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#53DBC3",
        tabBarInactiveTintColor: "#888",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Post"
        component={Post}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Criar"
        component={CriarPost}
        options={{
          tabBarLabel: "Criar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="EditarPerfil"
        component={EditarPerfil}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreenComponent} // Use o componente SplashScreen
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={Login}
      />

      <Stack.Screen
        name="Cadastrar"
        options={{ headerShown: false }}
        component={Cadastrar}
      />

      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CriarPost"
        component={CriarPost}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;