import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/Theme";
import EmptyStateComponent from "@/Components/EmptyState";
import { useRouter } from "expo-router";

export default function Explore() {
   const { theme } = useTheme();
   const router = useRouter();

   return (
      <SafeAreaView
         style={{
            flex: 1,
            backgroundColor: theme.background.primary,
         }}
      >
         <EmptyStateComponent
            title="Explore Coming Soon"
            message="Discover Pokémon by generation, region, and more. Backend is ready; frontend features will be added soon."
            showSkeleton={true}
            skeletonCount={4}
            actionText="Go Home"
            onAction={() => {
               router.push("/(Tabs)");
            }}
         />
      </SafeAreaView>
   );
}
