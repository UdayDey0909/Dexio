import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/Theme";
import EmptyStateComponent from "@/Components/EmptyState";
import { useRouter } from "expo-router";

export default function Battle() {
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
            title="Battle Features Coming Soon"
            message="Team builder, battle simulation, and damage calculator. Backend is ready; frontend features will be added soon."
            showSkeleton={true}
            skeletonCount={2}
            actionText="Go Home"
            onAction={() => {
               router.push("/(Tabs)");
            }}
         />
      </SafeAreaView>
   );
}
