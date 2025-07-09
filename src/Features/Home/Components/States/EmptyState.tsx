import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../Constants/Colors";

const EmptyState: React.FC = () => {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>No Pokémon found</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
   },
   text: {
      color: COLORS.text.light,
      fontSize: 18,
      textAlign: "center",
      marginTop: 40,
      fontWeight: "400",
   },
});

export default EmptyState;
