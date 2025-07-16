import React from "react";
import {
   View,
   Text,
   StyleSheet,
   ActivityIndicator,
   SafeAreaView,
   StatusBar,
} from "react-native";

interface LoadingViewProps {
   backgroundColor?: string;
   message?: string;
   color?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({
   backgroundColor = "#222",
   message = "Loading...",
   color = "#fff",
}) => {
   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color} />
            <Text style={[styles.loadingText, { color }]}>{message}</Text>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   loadingText: {
      fontSize: 16,
      marginTop: 10,
   },
});

export default LoadingView;
