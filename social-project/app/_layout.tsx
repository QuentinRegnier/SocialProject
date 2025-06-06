// app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { ReadyProvider, useReady } from '../components/ReadyContext';
import { Slot } from 'expo-router';
import LoadingScreen from './'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function InnerLayout() {
  const { appReady } = useReady();
  const [showApp, setShowApp] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (appReady && !showApp) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease), // Ajoute de la fluidité
        useNativeDriver: true,
      }).start(() => {
        setShowApp(true);
      });
    }
  }, [appReady]);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReadyProvider>
        <InnerLayout />
      </ReadyProvider>
    </GestureHandlerRootView>
  );
}