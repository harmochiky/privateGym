import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AgendaScreen from "./pages/Agenda";
import Profile from "./pages/Profile";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./pages/AppNavigator";
import Theme from "./pages/navigationTheme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import asyncStorage from "./lib/asyncStorage";
import { setUser } from "./store/authSlice";

axios.defaults.baseURL = "https://fortapplication.azurewebsites.net/api";
SplashScreen.preventAutoHideAsync();

export default function App() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);
  const authenticated = useSelector((state) => state.auth?.authenticated);

  useEffect(() => {
    rememberUser();
  }, []);

  const rememberUser = async () => {
    let user_data = await asyncStorage.getUserObj();

    if (user_data) {
      user_data = JSON.parse(user_data);
      console.log({ user_data });
      dispatch(setUser(user_data));
      setAppIsReady(true);
    } else {
      setAppIsReady(true);
    }
  };

  if (!appIsReady) {
    return null;
  } else {
    SplashScreen.hideAsync();
    return (
      <>
        <NavigationContainer theme={Theme}>
          <AppNavigator auth={authenticated} />
        </NavigationContainer>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
