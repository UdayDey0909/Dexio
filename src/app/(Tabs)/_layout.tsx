import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/Theme";

export default function TabLayout() {
   const { theme, isDark } = useTheme();

   return (
      <Tabs
         initialRouteName="Home"
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.text.muted,
            tabBarStyle: [
               styles.tabBarStyle,
               { backgroundColor: theme.background.primary },
            ],
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: "600",
               paddingBottom: 2,
               color: isDark ? theme.text.primary : theme.text.dark,
            },
            headerStyle: { backgroundColor: theme.background.primary },
            headerTintColor: theme.text.primary,
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
      borderTopWidth: 0,
   },
});
