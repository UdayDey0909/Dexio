// src/Features/Home/components/PokemonTypeIcons.tsx
import React from "react";
import { View, ViewStyle } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

interface TypeIconProps {
   size?: number;
   color?: string;
   style?: ViewStyle;
}

// Bug Type Icon
export const BugIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#A8B820",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2ZM12 10C9.79 10 8 11.79 8 14C8 16.21 9.79 18 12 18C14.21 18 16 16.21 16 14C16 11.79 14.21 10 12 10ZM12 20C9.79 20 8 21.79 8 22H16C16 21.79 14.21 20 12 20Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Dark Type Icon
export const DarkIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#705848",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.45 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 3.45 13.8 3 13.41 2.59C13 2.19 12.5 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Dragon Type Icon
export const DragonIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#7038F8",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C8.13 2 5 5.13 5 9C5 12.87 8.13 16 12 16C15.87 16 19 12.87 19 9C19 5.13 15.87 2 12 2ZM12 18C7.03 18 3 14.97 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10C21 14.97 16.97 18 12 18Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Electric Type Icon
export const ElectricIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#F8D030",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path d="M14 2L8 10H12L10 22L16 14H12L14 2Z" fill={color} />
      </Svg>
   </View>
);

// Fairy Type Icon
export const FairyIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#EE99AC",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Fighting Type Icon
export const FightingIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#C03028",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M6 2C4.89 2 4 2.89 4 4V8C4 9.11 4.89 10 6 10H8V12H6C4.89 12 4 12.89 4 14V18C4 19.11 4.89 20 6 20H8V22H16V20H18C19.11 20 20 19.11 20 18V14C20 12.89 19.11 12 18 12H16V10H18C19.11 10 20 9.11 20 8V4C20 2.89 19.11 2 18 2H6Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Fire Type Icon
export const FireIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#F08030",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8ZM12 22C7.03 22 3 17.97 3 13C3 8.03 7.03 4 12 4C16.97 4 21 8.03 21 13C21 17.97 16.97 22 12 22Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Flying Type Icon
export const FlyingIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#A890F0",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM21 9H16L13 7V5.5C13 4.12 11.88 3 10.5 3S8 4.12 8 5.5V7L5 9H3V11H5L8 13V14.5C8 15.88 9.12 17 10.5 17S13 15.88 13 14.5V13L16 11H21V9Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Ghost Type Icon
export const GhostIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#705898",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C8.13 2 5 5.13 5 9V15C5 16.11 5.89 17 7 17H8V19C8 20.11 8.89 21 10 21H14C15.11 21 16 20.11 16 19V17H17C18.11 17 19 16.11 19 15V9C19 5.13 15.87 2 12 2ZM9 13C8.45 13 8 12.55 8 12S8.45 11 9 11 10 11.45 10 12 9.55 13 9 13ZM15 13C14.45 13 14 12.55 14 12S14.45 11 15 11 16 11.45 16 12 15.55 13 15 13Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Grass Type Icon
export const GrassIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#78C850",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4V6C10 7.11 10.89 8 12 8C13.11 8 14 7.11 14 6V4C14 2.89 13.11 2 12 2ZM6 6C4.89 6 4 6.89 4 8V10C4 11.11 4.89 12 6 12C7.11 12 8 11.11 8 10V8C8 6.89 7.11 6 6 6ZM18 6C16.89 6 16 6.89 16 8V10C16 11.11 16.89 12 18 12C19.11 12 20 11.11 20 10V8C20 6.89 19.11 6 18 6ZM12 10C8.69 10 6 12.69 6 16V20C6 21.11 6.89 22 8 22H16C17.11 22 18 21.11 18 20V16C18 12.69 15.31 10 12 10Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Ground Type Icon
export const GroundIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#E0C068",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M3 17H21L18 14H15L12 11H9L6 14H3V17ZM5 19H19V21H5V19Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Ice Type Icon
export const IceIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#98D8D8",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Normal Type Icon
export const NormalIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#A8A878",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Circle cx="12" cy="12" r="10" fill={color} />
      </Svg>
   </View>
);

// Poison Type Icon
export const PoisonIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#A040A0",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8ZM12 22C7.03 22 3 17.97 3 13C3 8.03 7.03 4 12 4C16.97 4 21 8.03 21 13C21 17.97 16.97 22 12 22Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Psychic Type Icon
export const PsychicIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#F85888",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8ZM9 13C8.45 13 8 12.55 8 12S8.45 11 9 11 10 11.45 10 12 9.55 13 9 13ZM15 13C14.45 13 14 12.55 14 12S14.45 11 15 11 16 11.45 16 12 15.55 13 15 13Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Rock Type Icon
export const RockIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#B8A038",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M3 17H21L18 14H15L12 11H9L6 14H3V17ZM5 19H19V21H5V19ZM12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Steel Type Icon
export const SteelIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#B8B8D0",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8ZM12 22C7.03 22 3 17.97 3 13C3 8.03 7.03 4 12 4C16.97 4 21 8.03 21 13C21 17.97 16.97 22 12 22Z"
            fill={color}
         />
         <Circle cx="12" cy="12" r="4" fill="#ffffff" />
      </Svg>
   </View>
);

// Water Type Icon
export const WaterIcon: React.FC<TypeIconProps> = ({
   size = 24,
   color = "#6890F0",
   style,
}) => (
   <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
         <Path
            d="M12 2C10.89 2 10 2.89 10 4C10 5.11 10.89 6 12 6C13.11 6 14 5.11 14 4C14 2.89 13.11 2 12 2ZM12 8C8.69 8 6 10.69 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 10.69 15.31 8 12 8Z"
            fill={color}
         />
      </Svg>
   </View>
);

// Type Icon Map
export const TypeIconMap = {
   bug: BugIcon,
   dark: DarkIcon,
   dragon: DragonIcon,
   electric: ElectricIcon,
   fairy: FairyIcon,
   fighting: FightingIcon,
   fire: FireIcon,
   flying: FlyingIcon,
   ghost: GhostIcon,
   grass: GrassIcon,
   ground: GroundIcon,
   ice: IceIcon,
   normal: NormalIcon,
   poison: PoisonIcon,
   psychic: PsychicIcon,
   rock: RockIcon,
   steel: SteelIcon,
   water: WaterIcon,
};

// Generic Type Icon Component
interface PokemonTypeIconProps {
   type: string;
   size?: number;
   style?: ViewStyle;
}

export const PokemonTypeIcon: React.FC<PokemonTypeIconProps> = ({
   type,
   size = 24,
   style,
}) => {
   const IconComponent =
      TypeIconMap[type.toLowerCase() as keyof typeof TypeIconMap] || NormalIcon;

   return <IconComponent size={size} style={style} />;
};
