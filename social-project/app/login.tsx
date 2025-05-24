import { View, Text, StyleSheet } from 'react-native';
import { useReady } from '../components/ReadyContext';
import { useEffect } from 'react';

export default function Login() {
  const { setScreenReady } = useReady();

  useEffect(() => {
    // Simule un chargement des assets / images
    const timer = setTimeout(() => setScreenReady(true), 1000);

    return () => {
      setScreenReady(false);
      clearTimeout(timer);
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});