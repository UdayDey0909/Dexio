import React from "react";
import ErrorRetry from "@/Components/ErrorRetry";

interface ErrorStateProps {
   error: Error;
   onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
   return (
      <ErrorRetry
         message={`Error loading Pokémon: ${error.message}`}
         onRetry={onRetry || (() => {})}
         showRetryButton={!!onRetry}
      />
   );
};

export default ErrorState;
