import React from "react";
import { View, ViewStyle } from "react-native";
import { getTypeColor } from "@/Theme/Utils/PokeBallBG";
import {
   BugIcon,
   DarkIcon,
   DragonIcon,
   ElectricIcon,
   FairyIcon,
   FightingIcon,
   FireIcon,
   FlyingIcon,
   GhostIcon,
   GrassIcon,
   GroundIcon,
   IceIcon,
   NormalIcon,
   PoisonIcon,
   PsychicIcon,
   RockIcon,
   SteelIcon,
   WaterIcon,
} from "@/Assets/SVG/PokemonTypeIcons";

const TypeIconMap = {
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

interface PokemonTypeIconProps {
   type: string;
   size?: number;
   style?: ViewStyle;
   color?: string;
   background?: boolean;
}

const PokemonTypeIcon: React.FC<PokemonTypeIconProps> = ({
   type,
   size = 24,
   style,
   color = "#FFFFFF",
   background = false,
}) => {
   const IconComponent =
      TypeIconMap[type.toLowerCase() as keyof typeof TypeIconMap] || NormalIcon;

   if (background) {
      const bgColor = getTypeColor(type);
      return (
         <View
            style={[
               {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: bgColor,
                  alignItems: "center",
                  justifyContent: "center",
               },
               style,
            ]}
         >
            <IconComponent size={size * 0.7} color={color} />
         </View>
      );
   }
   return <IconComponent size={size} color={color} style={style} />;
};

export default PokemonTypeIcon;
