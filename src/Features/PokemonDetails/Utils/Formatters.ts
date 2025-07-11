export const formatHeight = (
   height: number,
   useMetric: boolean = true
): string => {
   if (useMetric) {
      return `${(height / 10).toFixed(1)} m`;
   } else {
      const totalInches = Math.round(height * 3.937);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      return `${feet}'${inches}"`;
   }
};

export const formatWeight = (
   weight: number,
   useMetric: boolean = true
): string => {
   if (useMetric) {
      return `${(weight / 10).toFixed(1)} kg`;
   } else {
      return `${(weight * 0.220462).toFixed(1)} lbs`;
   }
};

export const formatStatName = (statName: string): string => {
   const statNames: Record<string, string> = {
      hp: "HP",
      attack: "Attack",
      defense: "Defense",
      "special-attack": "Sp. Attack",
      "special-defense": "Sp. Defense",
      speed: "Speed",
   };
   return statNames[statName] || statName;
};

export const getStatColor = (statValue: number): string => {
   if (statValue >= 100) return "#4CAF50"; // Green
   if (statValue >= 70) return "#FF9800"; // Orange
   if (statValue >= 50) return "#2196F3"; // Blue
   return "#F44336"; // Red
};
