import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";

interface InfoBlockProps {
   icon: any;
   label: string;
   value: string;
   theme: any;
   labelColor?: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({
   icon,
   label,
   value,
   theme,
   labelColor,
}) => (
   <View style={styles.infoBlockColumn}>
      <Text
         style={[styles.sectionHeader, { color: labelColor || theme.accent }]}
      >
         {label}
      </Text>
      <View style={styles.infoBlock}>
         <MaterialCommunityIcons
            name={icon}
            size={18}
            color={theme.text.secondary}
            style={{ marginRight: 6 }}
         />
         <Text style={[styles.infoValue, { color: theme.text.primary }]}>
            {value}
         </Text>
      </View>
   </View>
);

export default InfoBlock;
