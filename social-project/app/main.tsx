import React, { useState, useRef, useEffect, use, JSX } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, useColorScheme, Image, Animated, RefreshControl } from 'react-native';
// ################# Components #################
import NavBar from '../components/NavBar';
import Post from '../components/Post';
import PlaceholderPost from '../components/PlaceholderPost';
import { TAB_BAR_HEIGHT } from '@/components/NavBar';
// ################# Styles #################
import { LightTheme, DarkTheme } from '@/constants/Colors';
// ################# Loading Strategy #################
import { useReady } from '../components/ReadyContext';
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
  const isOffline = useNetworkStatus();
  useEffect(() => {
    console.log("Statut de la connexion :", isOffline ? "Hors ligne" : "En ligne");
  }, [isOffline]);
  const [localInfoUser, setLocalInfoUser] = useState<any | null>(null);
  const init_infoUser = require('../assets/data-user/profile-info.json');
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
    setPostRecommandation([]); // Supprimer les posts actuels (optionnel)
    setPostsReady(new Set());
    setPlaceholdersGone(new Set());
    await fetchData();
    setRefreshing(false);
  };
  // ########### Ready Context ###########
  const { setScreenReady } = useReady();
  const [layoutReady, setLayoutReady] = useState(false);
  const [navBarReady, setNavBarReady] = useState(false);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const showNavBar = navBarReady && layoutReady && profileImageLoaded;
  const navBarOpacity = useRef(new Animated.Value(0)).current;
  const [localProfileImageUri, setLocalProfileImageUri] = useState<string | null>(null);
  const [postsReady, setPostsReady] = useState<Set<number>>(new Set());
  const [placeholdersGone, setPlaceholdersGone] = useState<Set<number>>(new Set());
  const markPostReady = (postId: number) => {
    setPostsReady(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
  };
  
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
    if (layoutReady && navBarReady) {
      setScreenReady(true);
    }
  }, [layoutReady, navBarReady]);
  // ########### Render Post ###########
  const [renderedPosts, setRenderedPosts] = useState<JSX.Element[]>([]);
  useEffect(() => {
    if (!postRecommandation) return;

    requestAnimationFrame(() => {
      const posts = postRecommandation.map((post) => (
        <Post
          key={`post-${post.id}`}
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
          onReady={markPostReady}
          isVisible={postsReady.has(post.id) && placeholdersGone.has(post.id)}
        />
      ));
      setRenderedPosts(posts);
    });
  }, [postRecommandation, postsReady]);
  useEffect(() => {
    if (!postRecommandation) return;

    postRecommandation.forEach((post) => {
      if (!postsReady.has(post.id) && !placeholdersGone.has(post.id)) {
        const timeout = setTimeout(() => {
          setPlaceholdersGone(prev => {
            const next = new Set(prev);
            next.add(post.id);
            return next;
          });
        }, 100);
        return () => clearTimeout(timeout);
      }
    });
  }, [postRecommandation, postsReady]);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} onLayout={() => setLayoutReady(true)}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} />
        {/* header */}
        <View style={[styles.header, { top: -insets.top, height: HEADER_HEIGHT + 2*insets.top }, { backgroundColor: theme.header }]}>
          <Text style={{ color: theme.text, fontSize: 24, padding: 16 }}>Naturist</Text>
        </View>
        {/* Main content scrollable */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={[styles.main, { top: -insets.top }, { backgroundColor: theme.background }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff0000']} // Couleur du spinner Android
              tintColor={theme.text} // Couleur spinner iOS
            />
          }
        >
        {renderedPosts.length > 0 ? renderedPosts : null}
        {isOffline ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Image source={require('../assets/images/no-connection.jpg')} style={{ width: 120, height: 120 }} />
              <Text style={{ color: theme.text, marginTop: 8 }}>Pas de connexion internet</Text>
            </View>
          ) : (
            postRecommandation?.map((post) => {
              return (
                <PlaceholderPost
                  isImage={post.IMAGES.length > 0}
                  isVisible={!postsReady.has(post.id)}
                  key={`placeholder-${post.id}`}
                />
              );
            })
          )
        }
      </ScrollView>
      {localProfileImageUri && (
        <Animated.View style={{ opacity: navBarOpacity }}>
          <NavBar isLight={isLight} imageUser={localProfileImageUri ?? undefined} isHome={true} onReady={() => setNavBarReady(true)} />
        </Animated.View>
      )}
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
});