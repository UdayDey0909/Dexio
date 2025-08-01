import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/Theme";
import EmptyStateComponent from "@/Components/EmptyState";
import { useRouter } from "expo-router";

export default function Search() {
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
            title="Search Coming Soon"
            message="Advanced search with filters, voice search, and search history. Backend is ready; frontend features will be added soon."
            showSkeleton={true}
            skeletonCount={3}
            actionText="Go Home"
            onAction={() => {
               router.push("/(Tabs)");
            }}
         />
      </SafeAreaView>
   );
}
