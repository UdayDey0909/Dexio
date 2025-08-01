import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/Theme";
import { Fonts } from "@/Theme/Fonts";

interface ErrorRetryProps {
   message?: string;
   onRetry: () => void;
   showRetryButton?: boolean;
   compact?: boolean;
}

const ErrorRetry: React.FC<ErrorRetryProps> = ({
   message = "Failed to load. Tap to retry.",
   onRetry,
   showRetryButton = true,
   compact = false,
}) => {
   const { theme } = useTheme();

   if (compact) {
      return (
         <Pressable
            style={[
               styles.compactContainer,
               {
                  backgroundColor: theme.background.card,
                  borderColor: theme.border.light,
               },
            ]}
            onPress={onRetry}
            android_ripple={{
               color: "rgba(0,0,0,0.1)",
               borderless: false,
            }}
         >
            <Text
               style={[
                  styles.compactText,
                  {
                     color: theme.text.secondary,
                  },
               ]}
            >
               {message}
            </Text>
         </Pressable>
      );
   }

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
            <Text
               style={[
                  styles.title,
                  {
                     color: theme.text.primary,
                  },
               ]}
            >
               Oops! Something went wrong
            </Text>

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

            {showRetryButton && (
               <Pressable
                  style={[
                     styles.retryButton,
                     {
                        backgroundColor: theme.primary,
                     },
                  ]}
                  onPress={onRetry}
                  android_ripple={{
                     color: "rgba(255,255,255,0.2)",
                     borderless: false,
                  }}
               >
                  <Text
                     style={[
                        styles.retryText,
                        {
                           color: theme.text.light,
                        },
                     ]}
                  >
                     Try Again
                  </Text>
               </Pressable>
            )}
         </View>
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
   title: {
      fontSize: 18,
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
   retryButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 120,
   },
   retryText: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
      fontFamily: Fonts.primaryMedium,
   },
   compactContainer: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      margin: 8,
      alignItems: "center",
   },
   compactText: {
      fontSize: 12,
      textAlign: "center",
      fontFamily: Fonts.primaryRegular,
   },
});

export default ErrorRetry;
