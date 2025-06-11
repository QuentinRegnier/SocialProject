import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LightTheme, DarkTheme } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import IconNavBar from '@/assets/icons/IconNavBar';


const { width } = Dimensions.get('window');
export const TAB_BAR_HEIGHT = 66;
const TAB_BAR_RADIUS = 36;
const ICON_SIZE = 30;

interface NavBarProps {
  isLight: boolean;
  imageUser: string | undefined;
  isHome?: boolean;
  isChat?: boolean;
  isSearch?: boolean;
  isIOS?: boolean;
  activeTab?: '/(tabs)/main' | '/(tabs)/chat' | '/(tabs)/search'; // Pour gérer l'onglet actif
  onReady?: () => void; // Callback pour signaler que la navBar est prête
}

const NavBar: React.FC<NavBarProps> = ({ isLight, imageUser, isHome, isChat, isSearch, isIOS, activeTab, onReady }) => {
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
    <View
      style={[
        styles.navContainer,
        {
          bottom: 24,
          left: 20,
          right: 20,
          height: TAB_BAR_HEIGHT + insets.bottom,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }
      ]}
      onLayout={() => setLayoutReady(true)}
    >
      {/* Capsule principale avec 4 icônes */}
      <BlurView
        intensity={20}
        tint={isLight ? 'light' : 'dark'}
        style={styles.capsuleBlur}
      >
        <View style={styles.capsuleInnerBorder} />
        <View style={styles.glassRadialOverlay} pointerEvents="none" />
        <View style={[styles.iconRow, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.iconWrapper}>
            <IconNavBar
              ICON_SIZE={ICON_SIZE}
              NAME="home"
              IS_ACTIVE={!!isHome}
              IS_IOS={!!isIOS}
              IS_LIGHT={isLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push({ pathname: '/(tabs)/post-image-text', params: { prevPage: activeTab } })}
          >
            <IconNavBar
              ICON_SIZE={ICON_SIZE}
              NAME="post"
              IS_ACTIVE={false}
              IS_IOS={!!isIOS}
              IS_LIGHT={isLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <IconNavBar
              ICON_SIZE={ICON_SIZE}
              NAME="chat"
              IS_ACTIVE={!!isChat}
              IS_IOS={!!isIOS}
              IS_LIGHT={isLight}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <IconNavBar
              ICON_SIZE={ICON_SIZE}
              NAME="profile"
              IS_ACTIVE={false}
              IS_IOS={!!isIOS}
              IS_LIGHT={isLight}
              URI={imageUser}
            />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Bulle circulaire isolée avec la photo de profil */}
      <BlurView
        intensity={30}
        tint={isLight ? 'light' : 'dark'}
        style={[styles.bubbleBlur, { marginLeft: 8 }]}
      >
        <View style={styles.bubbleInnerBorder} />
        <View style={styles.glassRadialOverlay} pointerEvents="none" />
        <TouchableOpacity>
          <IconNavBar
              ICON_SIZE={ICON_SIZE}
              NAME="search"
              IS_ACTIVE={!!isSearch}
              IS_IOS={!!isIOS}
              IS_LIGHT={isLight}
              NO_TEXT={true}
            />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    borderRadius: TAB_BAR_RADIUS,
    overflow: 'visible',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },

  capsuleBlur: {
    flexDirection: 'row',
    borderRadius: 32,
    height: 62, // uniforme avec la bulle
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },

  capsuleInnerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 32,
    shadowColor: '#fff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  glassRadialOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    opacity: 0.6,
  },

  iconRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  iconWrapper: {
    marginHorizontal: 10,
    marginTop: 27,
  },

  bubbleBlur: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },

  bubbleInnerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 31,
    shadowColor: '#fff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
// créer une analyse des pixels sous la barre de navigation pour changer le IS_LIGHT des icones pour une meilleure visibilité

export default NavBar;