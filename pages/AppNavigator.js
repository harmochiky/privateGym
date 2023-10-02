import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import HomePage from "./Agenda";
import Login from "./Login";
import Register from "./Register";

// Tabs
import ClientTabNavigator from "./ClientTabNavigator";
import CoachTabNavigator from "./CoachTabNavigator";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

const AppRoutes = ({ auth }) => {
  const userType = useSelector((state) => state.auth?.user?.user_Type);

  if (!auth) {
    return (
      <>
        <Stack.Navigator
          options={{
            headerTitleAlign: "center",
          }}
          defaultScreenOptions={{
            headerShown: false,
            animation: "none",
          }}
          initialRouteName={"Login"}
        >
          <Stack.Screen
            name={"Login"}
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={"Register"}
            component={Register}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </>
    );
  }

  console.log({ userType });

  if (userType === "Coach") {
    return (
      <Stack.Navigator
        options={{
          title: "Home",
          headerTitleAlign: "center",
        }}
        defaultScreenOptions={{
          headerShown: false,
          animation: "none",
        }}
        initialRouteName={"CoachTabNavigator"}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            animation: "none",
          }}
          name={"CoachTabNavigator"}
          component={CoachTabNavigator}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <Stack.Navigator
        options={{
          title: "Home",
          headerTitleAlign: "center",
        }}
        defaultScreenOptions={{
          headerShown: false,
          animation: "none",
        }}
        initialRouteName={"ClientTabNavigator"}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            animation: "none",
          }}
          name={"ClientTabNavigator"}
          component={ClientTabNavigator}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppRoutes;
