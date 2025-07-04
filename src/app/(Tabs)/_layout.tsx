import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
   return (
      <Tabs
         initialRouteName="Home"
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#22d3ee",
            tabBarInactiveTintColor: "#94a3b8",
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: "600",
               paddingBottom: 2,
            },
            headerStyle: { backgroundColor: "#0f172a" },
            headerTintColor: "#f8fafc",
         }}
      >
         <Tabs.Screen
            name="Home"
            options={{
               title: "Home",
               tabBarIcon: ({ color }) => (
                  <Ionicons name="home-outline" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="Explore"
            options={{
               title: "Explore",
               tabBarIcon: ({ color }) => (
                  <Ionicons name="compass-outline" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="Search"
            options={{
               title: "Search",
               tabBarIcon: ({ color }) => (
                  <Ionicons name="search" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="Battle"
            options={{
               title: "Battle",
               tabBarIcon: ({ color }) => (
                  <Ionicons name="flash-outline" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="Profile"
            options={{
               title: "Trainer",
               tabBarIcon: ({ color }) => (
                  <Ionicons
                     name="person-circle-outline"
                     size={24}
                     color={color}
                  />
               ),
               headerShown: false,
            }}
         />
      </Tabs>
   );
}

const styles = StyleSheet.create({
   tabBarStyle: {
      backgroundColor: "#0f172a",
      borderTopWidth: 0,
   },
});
