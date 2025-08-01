import React from "react";
import EmptyStateComponent from "@/Components/EmptyState";

const EmptyState: React.FC = () => {
   return (
      <EmptyStateComponent
         title="No Pokémon Found"
         message="Try adjusting your search criteria or check your connection."
         showSkeleton={false}
      />
   );
};

export default EmptyState;
