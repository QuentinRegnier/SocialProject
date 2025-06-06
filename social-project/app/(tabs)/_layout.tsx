// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
    }}
    >
    <Tabs.Screen name="main" options={{ title: 'Accueil' }} />
    <Tabs.Screen name="post-image-text" options={{ title: 'Photo' }} />
    <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
    </Tabs>
  );
}