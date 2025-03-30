import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000); // 6 seconds delay before showing the main app
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image 
          source={require('../images/GreatJob.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.quote}>“Find a great job to do a great job!”</Text>
      </View>
    );
  }

  return null; // When loading is complete, return null or the main app view
};

const { width } = Dimensions.get('window'); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0eaf8f', 
  },
  logo: {
    width: width * 0.8, 
    height: 150, 
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    color: 'white', 
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default LoadingScreen;
