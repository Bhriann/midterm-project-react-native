import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import JobFinderScreen from "../screens/JobFinderScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import ApplicationFormScreen from "../screens/ApplicationFormScreen";
import SavedJobsScreen from "../screens/SavedJobsScreen";
import AppliedJobsScreen from "../screens/AppliedJobsScreen";
import { useTheme } from "../context/ThemeContext";

export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  AppliedJobs: undefined;
  JobDetails: { job: any };
  ApplicationForm: { job: any };
  Main: undefined;
};

export type RootTabParamList = {
  Saved: undefined;
  Search: undefined;
  Applied: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function JobFinderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobFinder" component={JobFinderScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const insets = useSafeAreaInsets();
  const tabBarColor = isDarkMode ? "#222" : "#0eaf8f";

  return (
    <View style={[styles.flexContainer, { backgroundColor: tabBarColor }]}>
      <SafeAreaView style={styles.flexContainer} edges={["top", "left", "right"]}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size }) => {
              const iconMap: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
                Saved: "bookmark",
                Search: "search",
                Applied: "checkmark-circle",
              };
              return (
                <Ionicons
                  name={iconMap[route.name]}
                  size={size}
                  color={focused ? (isDarkMode ? "#34ebc0" : "#02624f") : isDarkMode ? "#bbb" : "white"}
                />
              );
            },
            tabBarActiveTintColor: isDarkMode ? "#34ebc0" : "#02624f",
            tabBarInactiveTintColor: isDarkMode ? "#bbb" : "white",
            tabBarStyle: {
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
              backgroundColor: tabBarColor,
              borderTopWidth: 0,
            },
            tabBarLabelStyle: styles.tabLabel,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Saved" component={SavedJobsScreen} />
          <Tab.Screen name="Search" component={JobFinderStack} />
          <Tab.Screen name="Applied" component={AppliedJobsScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </View>
  );
}

function AppNavigator() {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AppNavigator;