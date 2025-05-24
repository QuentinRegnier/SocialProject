// /app/_layout.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ReadyProvider, useReady } from '../components/ReadyContext';
import { Slot } from 'expo-router';
import LoadingScreen from './'; // assure-toi que ce fichier existe et exporte un composant par défaut

function InnerLayout() {
  const { screenReady } = useReady();
  const [showApp, setShowApp] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  React.useEffect(() => {
    if (screenReady && !showApp) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowApp(true);
      });
    }
  }, [screenReady]);

  return (
    <>
      {!showApp && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, backgroundColor: 'white', opacity: fadeAnim }]}>
          <LoadingScreen />
        </Animated.View>
      )}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </>
  );
}

export default function Layout() {
  return (
    <ReadyProvider>
      <InnerLayout />
    </ReadyProvider>
  );
}