import { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';

const isConnected = true; // À remplacer par ta logique d’auth

export default function Loading() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [destination, setDestination] = useState<"/login" | "/(tabs)/main" | null>(null);
  const hasNavigated = useRef(false);
  // ########### Fonts ###########
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    console.log("Chargement des polices...");
    Font.loadAsync({
      'Caveat': require('@/assets/fonts/Caveat-VariableFont_wght.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []); 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setDestination('/login');
    } else {
      if (!destination) {
        setDestination('/(tabs)/main');
      }
    }
  }, [destination]);

  useEffect(() => {
    if (destination && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace(destination);
    }
  }, [destination]);
  if (!fontsLoaded) {
    return null; // ou un loader simple
  }
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={[styles.text, { fontFamily: 'Caveat'}]}>Naturist</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});