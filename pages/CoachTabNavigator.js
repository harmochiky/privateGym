import React from "react";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Agenda from "./Agenda";
import { View, StyleSheet, Text } from "react-native";
import colors from "../components/colors";
import Profile from "./Profile";
import ClientBook from "./ClientBook";
import { useSelector } from "react-redux";
import CoachAgenda from "./CoachAgenda";

const Tab = createBottomTabNavigator();

const TabBar = (props) => {
  return (
    <>
      <BottomTabBar
        {...props}
        style={{
          padding: 10,
        }}
      />
    </>
  );
};

const CustomBottomIndicator = ({ icon, text, size, focused, color }) => {
  return (
    <View style={styles.labelContainer}>
      {icon}
      <Text style={[styles.labelStyle, { color: color }]}>{text}</Text>
      <View style={[focused ? styles.indicator : styles.noindicator]} />
    </View>
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.secondary,
          // borderTopWidth: 2,
          paddingTop: 7,
          height: 100,
        },
        tabBarShowLabel: false,
      }}
      tabBar={TabBar}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <CustomBottomIndicator
              focused={focused}
              text="Bookings"
              color={color}
              icon={<Ionicons name="barbell" color={color} size={size} />}
            />
          ),
        }}
        name={"Bookings"}
        component={CoachAgenda}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <CustomBottomIndicator
              focused={focused}
              text="Book Session"
              color={color}
              icon={<Ionicons name="calendar" color={color} size={size} />}
            />
          ),
        }}
        name={"BookSessions"}
        component={ClientBook}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <CustomBottomIndicator
              focused={focused}
              text="Profile"
              color={color}
              icon={
                <Ionicons name="md-person-circle" color={color} size={size} />
              }
            />
          ),
        }}
        name={"ProfileNavigator"}
        component={Profile}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottombar_view: {
    backgroundColor: "red",
    height: 15,
    width: 15,
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  labelStyle: {
    marginVertical: 3,
    fontWeight: "600",
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
  noindicator: {
    height: 8,
    width: 8,
    backgroundColor: colors.transparent,
    borderRadius: 100,
  },
});

export default TabNavigator;
