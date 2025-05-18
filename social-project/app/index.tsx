import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import NavBar from '../components/NavBar';
import { TAB_BAR_HEIGHT } from '@/components/NavBar';
import { LightTheme, DarkTheme } from '@/constants/Colors';

const {height, width} = Dimensions.get('window');
const HEADER_HEIGHT = 120;

export default function App() {
  const scheme = useColorScheme();
  const isLight = scheme === 'light';
  const theme = isLight ? LightTheme : DarkTheme;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
        {/* header */}
        <View style={[styles.header, styles.light_mode]} />
        {/* Main content scrollable */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.main}
          showsVerticalScrollIndicator={false}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <View key={i} style={styles.post}>
              <Text>Post #{i + 1}</Text>
            </View>
          ))}
        </ScrollView>
        <NavBar isLight={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#ffffff',
  },
  main: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_HEIGHT + 20, // Pour laisser de l'espace en bas
  },
  post: {
    height: 100,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light_mode: {
    backgroundColor: '#ffffff',
  }
});