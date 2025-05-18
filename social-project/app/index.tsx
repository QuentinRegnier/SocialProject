import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {height, width} = Dimensions.get('window');
const HEADER_HEIGHT = 120;
const TAB_BAR_HEIGHT = 100;
const TAB_BAR_RADIUS = 36;

export default function App() {
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

        {/* Bottom Tab Bar */}
        <View style={[styles.tabBar, styles.light_mode]}>
          <Text style={styles.text}>Navigation</Text>
        </View>
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
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: TAB_BAR_RADIUS,
    borderTopRightRadius: TAB_BAR_RADIUS,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 100, // S'assurer qu'elle passe devant le ScrollView
  },
  text: {
    color: '#333',
    fontWeight: 'bold',
  },
  light_mode: {
    backgroundColor: '#ffffff',
  }
});