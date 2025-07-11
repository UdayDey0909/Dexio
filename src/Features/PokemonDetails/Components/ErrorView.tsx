import React from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   SafeAreaView,
   StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

interface ErrorViewProps {
   backgroundColor: string;
   error: string;
   onRetry?: () => void;
   showGoBack?: boolean;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
   backgroundColor,
   error,
   onRetry,
   showGoBack = false,
}) => {
   const router = useRouter();

   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />
         <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
               <TouchableOpacity style={styles.button} onPress={onRetry}>
                  <Text style={styles.buttonText}>Retry</Text>
               </TouchableOpacity>
            )}
            {showGoBack && (
               <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.back()}
               >
                  <Text style={styles.buttonText}>Go Back</Text>
               </TouchableOpacity>
            )}
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   errorText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
   },
   button: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginTop: 10,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
   },
});
