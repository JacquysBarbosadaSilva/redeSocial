import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login";

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsNavigator() {
  return (
    <Tabs.Navigator>
    </Tabs.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }}
        initialRouteName="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default StackNavigator;