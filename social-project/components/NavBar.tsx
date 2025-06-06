import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import HomeIcon from '@/assets/icons/HomeIcon';
import ChatIcon from '@/assets/icons/ChatIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import PubIcon from '@/assets/icons/PubIcon';
import { LightTheme, DarkTheme } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
export const TAB_BAR_HEIGHT = 66;
const TAB_BAR_RADIUS = 36;
const ICON_SIZE = 30;

interface NavBarProps {
  isLight: boolean;
  imageUser: string | undefined;
  isHome?: boolean;
  isChat?: boolean;
  activeTab?: '/(tabs)/main' | '/(tabs)/chat' | '/(tabs)/search'; // Pour gérer l'onglet actif
  onReady?: () => void; // Callback pour signaler que la navBar est prête
}

const NavBar: React.FC<NavBarProps> = ({ isLight, imageUser, isHome, isChat, activeTab, onReady }) => {
  const theme = isLight ? LightTheme : DarkTheme;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [layoutReady, setLayoutReady] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        if (!imageUser) return;
        await Image.prefetch(imageUser);
        setImagesPreloaded(true);
      } catch (error) {
        console.warn('Erreur préchargement image NavBar :', error);
        setImagesPreloaded(true); // fallback même en cas d'erreur
      }
    };

    preloadImages();
  }, [imageUser]);

  useEffect(() => {
    if (layoutReady && imagesPreloaded) {
      onReady?.(); // signale au parent que tout est prêt
    }
  }, [layoutReady, imagesPreloaded]);
  return (
    <View style={[
      styles.container, 
      { height: TAB_BAR_HEIGHT + insets.bottom }, { backgroundColor: theme.navBar }
      ]}
      onLayout={() => setLayoutReady(true)}
    >
      <TouchableOpacity style={(insets.bottom >0) ? { marginTop: -30 } : { marginTop: -10 }} >
        <HomeIcon color={isHome ? theme.activeIcon : theme.icon} size={ICON_SIZE} isHome={isHome} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={(insets.bottom >0) ? { marginTop: -30 } : { marginTop: -10 }}
      >
        <SearchIcon color={theme.icon} size={ICON_SIZE} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={(insets.bottom >0) ? { marginTop: -30 } : { marginTop: -10 }}
        onPress={() => router.push({ pathname: '/(tabs)/post-image-text', params: { prevPage: activeTab } })}
      >
        <PubIcon color={theme.icon} size={ICON_SIZE} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={(insets.bottom >0) ? { marginTop: -30 } : { marginTop: -10 }} 
        onPress={() => router.push('/(tabs)/chat')}
      >
          <ChatIcon color={isChat ? theme.activeIcon : theme.icon} size={ICON_SIZE} isChat={isChat} />
      </TouchableOpacity>
      <TouchableOpacity style={(insets.bottom >0) ? { marginTop: -30 } : { marginTop: -10 }} >
          <Image source={{ uri: imageUser }} style={styles.profilePicture} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: TAB_BAR_RADIUS,
    borderTopRightRadius: TAB_BAR_RADIUS,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 100,
    bottom: 0,
  },
  profilePicture:{
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 18
  }
});

export default NavBar;