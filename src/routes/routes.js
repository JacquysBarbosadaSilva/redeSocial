import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login";

const tabs = createBottomTabNavigator();
const stack = createNativeStackNavigator();

function TabsNavigator() {
  return (
    <tabs.Navigator>
    </tabs.Navigator>
  );
}

function StackNavigator() {
  return (
    <stack.Navigator>
      <stack.Screen name="Login" component={Login} />
    </stack.Navigator>
  );
}

export default StackNavigator();