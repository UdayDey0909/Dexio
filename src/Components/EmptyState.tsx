import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/Theme";
import { Fonts } from "@/Theme/Fonts";

interface EmptyStateProps {
   title: string;
   message: string;
   icon?: React.ReactNode;
   actionText?: string;
   onAction?: () => void;
   showSkeleton?: boolean;
   skeletonCount?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
   title,
   message,
   icon,
   actionText,
   onAction,
   showSkeleton = false,
   skeletonCount = 3,
}) => {
   const { theme } = useTheme();

   const renderSkeleton = () => {
      if (!showSkeleton) return null;

      return (
         <View style={styles.skeletonContainer}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
               <View
                  key={index}
                  style={[
                     styles.skeletonItem,
                     {
                        backgroundColor: theme.background.secondary,
                        borderColor: theme.border.light,
                     },
                  ]}
               >
                  <View
                     style={[
                        styles.skeletonHeader,
                        { backgroundColor: theme.background.card },
                     ]}
                  />
                  <View
                     style={[
                        styles.skeletonContent,
                        { backgroundColor: theme.background.card },
                     ]}
                  />
               </View>
            ))}
         </View>
      );
   };

   return (
      <View
         style={[
            styles.container,
            {
               backgroundColor: theme.background.primary,
            },
         ]}
      >
         <View
            style={[
               styles.content,
               {
                  backgroundColor: theme.background.card,
                  borderColor: theme.border.light,
               },
            ]}
         >
            {/* Icon */}
            {icon && <View style={styles.iconContainer}>{icon}</View>}

            {/* Title */}
            <Text
               style={[
                  styles.title,
                  {
                     color: theme.text.primary,
                  },
               ]}
            >
               {title}
            </Text>

            {/* Message */}
            <Text
               style={[
                  styles.message,
                  {
                     color: theme.text.secondary,
                  },
               ]}
            >
               {message}
            </Text>

            {/* Action Button */}
            {actionText && onAction && (
               <Pressable
                  style={[
                     styles.actionButton,
                     {
                        backgroundColor: theme.primary,
                     },
                  ]}
                  onPress={onAction}
                  android_ripple={{
                     color: "rgba(255,255,255,0.2)",
                     borderless: false,
                  }}
               >
                  <Text
                     style={[
                        styles.actionText,
                        {
                           color: theme.text.light,
                        },
                     ]}
                  >
                     {actionText}
                  </Text>
               </Pressable>
            )}
         </View>

         {/* Skeleton Preview */}
         {renderSkeleton()}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   content: {
      padding: 24,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      maxWidth: 300,
      width: "100%",
   },
   iconContainer: {
      marginBottom: 16,
      width: 64,
      height: 64,
      justifyContent: "center",
      alignItems: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
      fontFamily: Fonts.headingSemiBold,
   },
   message: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
      marginBottom: 20,
      fontFamily: Fonts.primaryRegular,
   },
   actionButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 120,
   },
   actionText: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
      fontFamily: Fonts.primaryMedium,
   },
   skeletonContainer: {
      marginTop: 32,
      width: "100%",
      maxWidth: 300,
   },
   skeletonItem: {
      height: 80,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 12,
      padding: 12,
   },
   skeletonHeader: {
      height: 16,
      width: "60%",
      borderRadius: 4,
      marginBottom: 8,
   },
   skeletonContent: {
      height: 12,
      width: "40%",
      borderRadius: 4,
   },
});

export default EmptyState;
