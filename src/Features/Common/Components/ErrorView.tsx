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
   backgroundColor?: string;
   error: string | Error;
   onRetry?: () => void;
   showGoBack?: boolean;
   color?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({
   backgroundColor = "#222",
   error,
   onRetry,
   showGoBack = false,
   color = "#fff",
}) => {
   const router = useRouter();
   const errorMsg = typeof error === "string" ? error : error.message;
   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />
         <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color }]}>{errorMsg}</Text>
            {onRetry && (
               <TouchableOpacity style={styles.button} onPress={onRetry}>
                  <Text style={[styles.buttonText, { color }]}>Retry</Text>
               </TouchableOpacity>
            )}
            {showGoBack && (
               <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.back()}
               >
                  <Text style={[styles.buttonText, { color }]}>Go Back</Text>
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
      fontSize: 16,
      fontWeight: "bold",
   },
});

export default ErrorView;
