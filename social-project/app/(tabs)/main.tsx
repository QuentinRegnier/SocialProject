import React, { useState, useRef, useEffect, use, JSX } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, Animated, useColorScheme, Image, RefreshControl, FlatList, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Font from 'expo-font';
// ################# Components #################
import NavBar from '../../components/NavBar';
import Post from '../../components/Post';
import { TAB_BAR_HEIGHT } from '@/components/NavBar';
import PreloadScreens from '@/components/PreloadScreens';
// ################# Styles #################
import { LightTheme, DarkTheme } from '@/constants/Colors';
// ################# Loading Strategy #################
import { useReady } from '@/components/ReadyContext';
// ################# Functions #################
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { API } from '@/utils/API';
import { searchFileSystem, fetchFileSystem, setFileSystem } from '@/utils/FileSystemsManager';
// ################################################

const {height, width} = Dimensions.get('window');
const HEADER_HEIGHT = 48;
const IMAGE_SIZE = width - 40;

// ###############################################
export default function Main() {
  //const isIOS = Platform.OS === 'ios';
  const initialNumToRender = 3;
  const maxToRenderPerBatch = 5;
  const windowSize = 10;
  // ###############################################
  const isOffline = useNetworkStatus();
  useEffect(() => {
    console.log("Statut de la connexion :", isOffline ? "Hors ligne" : "En ligne");
  }, [isOffline]);
  const [localInfoUser, setLocalInfoUser] = useState<any | null>(null);
  const init_infoUser = require('@/assets/data-user/profile-info.json');
  const initFilePath = 'profile-info.json';
  const initLocalInfoUser = async () => {
    await setFileSystem(initFilePath, undefined, init_infoUser);
    console.log("Données utilisateur initialisées dans le système de fichiers local");
  };
  useEffect(() => {
    initLocalInfoUser().catch(error => {
      console.error("Erreur lors de l'initialisation des données utilisateur :", error);
    });
  }, []);
  const localFilePath = 'profile-info.json';
  const fetchLocalInfoUser = async () => {
    const localData = await fetchFileSystem(localFilePath);
    if (localData) {
      setLocalInfoUser(JSON.parse(localData));
      console.log("Données utilisateur locales chargées avec succès");
    } else {
      console.warn("Aucune donnée locale trouvée pour l'utilisateur");
    }
  }
  useEffect(() => {
    fetchLocalInfoUser().catch(error => {
      console.error("Erreur lors du chargement des données utilisateur locales :", error);
    });
  }, []);
  useEffect(() => {
    console.log("Local Info User:", localInfoUser);
  }, [localInfoUser]);
  //useEffect(() => {
  //  clearFastImageCache();
  //}, []);
  // ########### API ###########
    // API_DATA
  const [infoUser, setInfoUser] = useState<any | null>(null);
  const [postRecommandation, setPostRecommandation] = useState<any[] | null>(null);
  const [lastChangeProfileImage, setLastChangeProfileImage] = useState<string | null>(null);
    // API_FETCH_DATA
  const fetchData = async () => {
    if (isOffline && !localInfoUser?.name) {
      console.warn("Aucune connexion internet et pas de données utilisateur locales");
      setInfoUser(null);
      setPostRecommandation(null);
    }else if (isOffline && localInfoUser?.name) {
      console.log("Chargement des données utilisateur locales");
      setInfoUser(localInfoUser);
      setPostRecommandation(null);
    }else{
      const info = await API("take-users-informations", localInfoUser.id);
      const posts = await API("take-post-recommandation", localInfoUser.id);
      if(localInfoUser?.name) setLastChangeProfileImage(localInfoUser.lastChangeProfileImage);
      setFileSystem("profile-info.json", undefined, info);
      console.log("Données utilisateur chargées depuis l'API");
      setInfoUser(info);
      setPostRecommandation(posts);
    }
  };
    // API_EXECUTE
  useEffect(() => {
    if (localInfoUser) {
      fetchData();
    }
  }, [localInfoUser]);
  // ########### Theme ###########
  const scheme = useColorScheme();
  const isLight = scheme === 'light';
  const theme = isLight ? LightTheme : DarkTheme;
  // ########### SafeArea ###########
  const insets = useSafeAreaInsets();
  // ########### Refresh Data ###########
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setPostLoadedIds(new Set()); // Réinitialiser le compteur de posts chargés
    setPostRecommandation([]); // Supprimer les posts actuels (optionnel)
    await fetchData();
    setRefreshing(false);
  };
  function predictedGeneratePosts(L: number, A: number, B: number, W: number, N: number): number {
    return Math.min(L, A + B * Math.floor(W / 2)) - N;
  }
  // ########### Fonts ###########
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    console.log("Chargement des polices...");
    Font.loadAsync({
      'Caveat': require('@/assets/fonts/Caveat-VariableFont_wght.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []); 
  // ########### Ready Context ###########
  const { setPageReady } = useReady();
  const [layoutReady, setLayoutReady] = useState(false);
  const [navBarReady, setNavBarReady] = useState(false);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const showNavBar = navBarReady && layoutReady && profileImageLoaded;
  const navBarOpacity = useRef(new Animated.Value(0)).current;
  const [localProfileImageUri, setLocalProfileImageUri] = useState<string | null>(null);
  const [postLoadedIds, setPostLoadedIds] = useState<Set<string>>(new Set());
  const onPostReady = (id: string) => {
    setPostLoadedIds(prev => new Set(prev).add(id));
  };
  useEffect(() => {
    console.log(postLoadedIds.size, postRecommandation?.length);
    console.log("Post Loaded:", postLoadedIds);
  }, [postLoadedIds, postRecommandation]);
  useEffect(() => {
    if (showNavBar) {
      Animated.timing(navBarOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showNavBar]);
  useEffect(() => {
    if (!postRecommandation || !infoUser || localProfileImageUri) return;
    let isCancelled = false;

    const loadProfileImage = async () => {
      try {
        if (infoUser.profileImage) {
          const extension = infoUser.profileImage.split('.').pop();
          if (lastChangeProfileImage === infoUser.lastChangeProfileImage) {
            const uri = await searchFileSystem('profile-image.' + extension);
            setLocalProfileImageUri(uri);
            setProfileImageLoaded(true);
          } else {
            setFileSystem('profile-image.' + extension, infoUser.profileImage);
            const uri = await searchFileSystem('profile-image.' + extension);
            if (uri) {
              setLocalProfileImageUri(uri);
              setProfileImageLoaded(true);
            }
            setLastChangeProfileImage(infoUser.lastChangeProfileImage);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setProfileImageLoaded(true);
        }
      }
    };

    loadProfileImage();

    return () => {
      isCancelled = true;
      setProfileImageLoaded(false);
    };
  }, [postRecommandation, infoUser]);
  useEffect(() => {
    if (layoutReady && navBarReady && fontsLoaded && postLoadedIds.size >= predictedGeneratePosts((postRecommandation?.length || 0), initialNumToRender, maxToRenderPerBatch, windowSize, 1)) {
      setPageReady('main', true);
    }
  }, [layoutReady, navBarReady, postLoadedIds, postRecommandation, fontsLoaded]); //regarder si on charge aucun post cela marche aussi
  // ########### Fludity refresh ###########
  const isReadyRefreshing = !refreshing || (refreshing && postLoadedIds.size < predictedGeneratePosts((postRecommandation?.length || 0), initialNumToRender, maxToRenderPerBatch, windowSize, 1)); 

  if (!fontsLoaded) {
    return null; // ou un loader simple
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} onLayout={() => setLayoutReady(true)}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} />
        {/* header */}
        <View style={[styles.header, { height: HEADER_HEIGHT + insets.top, paddingTop: insets.top }]}>
          {/* Blur progressif */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {/* Flou uniforme sur tout le header */}
            <BlurView
              tint={isLight ? 'light' : 'dark'}
              intensity={60}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Contenu du header */}
          <Text style={{ color: theme.text, fontSize: 40, padding: 0, fontFamily: 'Caveat' }}>Naturist</Text>
        </View>
        {/* Main content scrollable */}
        {!isOffline?(
        <FlatList
          data={postRecommandation}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: HEADER_HEIGHT + insets.top }  // ou un petit nombre
          ]}
          style={[
            styles.main,
            { backgroundColor: theme.background,  }
          ]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(post) => `post-${post.id}`}
          renderItem={({ item: post }) => (
            <Animated.View style={{ opacity: isReadyRefreshing ? 1 : 0 }}>
              <Post
                profileImage={post.profileImage}
                name={post.name}
                date={post.date}
                IMAGES={post.IMAGES}
                description={post.description}
                text={post.text}
                likes={post.likes}
                comments={post.comments}
                isLiked={post.isLiked}
                isCommented={post.isCommented}
                postId={post.id}
                theme={theme}
                onReady={() => onPostReady(post.id)}
              />
            </Animated.View>
          )}
          initialNumToRender={initialNumToRender}
          maxToRenderPerBatch={maxToRenderPerBatch}
          windowSize={windowSize}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            // ta pagination ici
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff0000']}
              tintColor={theme.text}
              progressViewOffset={HEADER_HEIGHT + insets.top}  // 👈 décalage du spinner
            />
          }
        />
        ):(
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/no-connection.jpg')}
              style={{ width: 220, height: 220, resizeMode: 'contain', marginBottom: 24 }}
            />
            <Text style={{ color: theme.text, fontSize: 18, textAlign: 'center' }}>
              Pas de connexion Internet
            </Text>
          </View>
        )}
      {localProfileImageUri && (
        <Animated.View style={{ opacity: navBarOpacity }}>
          <NavBar isLight={isLight} imageUser={localProfileImageUri ?? undefined} isHome={true} onReady={() => setNavBarReady(true)} activeTab='/(tabs)/main' isIOS={false} />
        </Animated.View>
      )}
      {/* Précharge en fond */}
      <PreloadScreens />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 10, // important sur Android
  },
  main: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20, // Pour laisser de l'espace en haut
    paddingBottom: TAB_BAR_HEIGHT + 20, // Pour laisser de l'espace en bas
  },
  post: {
    margin: 10,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingBottom: 16,
  },
  postContainerImage : {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  postContainerText : {
    width: IMAGE_SIZE,
    marginTop: 12,
    marginBottom: 8,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 18,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 4,
    borderRadius: 5,
  },
  profileContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  postDescription: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 4,
    marginTop: 2,
  },
  countText: {
     marginLeft: 6, 
     fontSize: 15,
  },
  postText: {
    fontSize: 15,
    textAlign: 'justify',
  },
  blurSegment: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 32,
  },
});

// Mettre isIOS={isIOS} sur la NavBar si tu veux gérer la plateforme correctement et réellement surtout
// Mettre un composant natif pour que le header soit un gradient flou progressif