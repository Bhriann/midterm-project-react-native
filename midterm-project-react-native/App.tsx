import React, { useEffect, useState } from 'react';
import { JobProvider } from './src/context/JobContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingScreen from './src/components/LoadingScreen'; 

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., 3 seconds)
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <ThemeProvider>
      <JobProvider>
        {isLoading ? <LoadingScreen /> : <AppNavigator />}
      </JobProvider>
    </ThemeProvider>
  );
};

export default App;



