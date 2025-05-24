import { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const isConnected = true; // À remplacer par ta logique d’auth

export default function Loading() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [destination, setDestination] = useState<'/main' | '/login' | null>(null);
  const hasNavigated = useRef(false); // Pour éviter la navigation multiple

  // Fade-in du texte "Mon App" dès que le composant est monté
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Détermine rapidement la destination (main ou login)
  useEffect(() => {
    const dest: '/main' | '/login' = isConnected ? '/main' : '/login';
    setDestination(dest);
  }, []);

  // Dès que le délai est passé et qu’on connaît la destination, on navigue
  useEffect(() => {
    if (destination && !hasNavigated.current) {
      hasNavigated.current = true; // Empêche la navigation multiple
      router.replace(destination);
    }
  }, [destination]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>Naturist</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
  },
});