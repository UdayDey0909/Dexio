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
   backgroundColor: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
   backgroundColor,
}) => {
   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading Pokémon...</Text>
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
      color: "#fff",
      fontSize: 16,
      marginTop: 10,
   },
});
