import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, useColorScheme, Image, TouchableOpacity, FlatList, Animated, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import NavBar from '../components/NavBar';
import { TAB_BAR_HEIGHT } from '@/components/NavBar';
import { LightTheme, DarkTheme } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SendIcon from '../assets/icons/SendIcon';
import GridIcon from '../assets/icons/GridIcon';
import LikeIcon from '../assets/icons/LikeIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import { useRouter } from 'expo-router';
import { useReady } from '../components/ReadyContext';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';

// API  
type APIRequest =
  | "take-users-informations"
  | "take-posts-informations"
  | "take-post-recommandation"
  | "add-like-post"
  | "delete-like-post";

async function API(request: APIRequest, data: any): Promise<any> {
  const intruct = {
    "take-users-informations": 1,
    "take-posts-informations": 2,
    "take-post-recommandation": 3,
    "add-like-post": 4,
    "delete-like-post": 5,
  };
  if (!(request in intruct)) return null;
  if (intruct[request] === 1){
    const response = await fetch(
      "http://192.168.1.2:8000/database/user.json"
    );
    const json = await response.json();
    return json[data];
  } // Users Informations
  if (intruct[request] === 2) {
    const response = await fetch(
      "http://192.168.1.2:8000/database/post.json"
    );
    const json = await response.json();
    const tableau = Array.isArray(json) ? json : Object.values(json);
    return tableau[0];
  } // Posts Informations as Array of ids
  if (intruct[request] === 3) {
    const response = await fetch(
      "http://192.168.1.2:8000/database/post.json"
    );
    const json = await response.json();
    const tableau = Array.isArray(json) ? json : Object.values(json);
    return tableau;
  } // Posts Recommandation
  if (intruct[request] === 4)console.log("Add like"); // Add like
  if (intruct[request] === 5)console.log("Delete like"); // Delete like
  return null;
}
// ################## Normals Functions ####################
function getText( id : number, language : string) : string {
  const fr = [
    "Il y a moins d'1h",
    "Il y a {0} h"
  ];
  if(language == "fr") return fr[id];
  return "";
}
function formaterDate(dateString: string): string {
  const moisNoms = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  // Conversion de la date jj-mm-aaaa hh:mm en objet Date
  const [datePart, timePart] = dateString.split(' ');
  const [jour, mois, annee] = datePart.split('-').map(Number);
  const [heure, minute] = timePart.split(':').map(Number);
  const dateEntree = new Date(annee, mois - 1, jour, heure, minute);

  const maintenant = new Date();
  const differenceMs = maintenant.getTime() - dateEntree.getTime();
  const differenceHeures = Math.floor(differenceMs / (1000 * 60 * 60));

  if (differenceHeures < 1) {
    return getText(0, "fr");
  } else if (differenceHeures < 24) {
    return getText(1, "fr").replace("{0}", differenceHeures.toString());
  } else {
    return `${jour} ${moisNoms[mois - 1]} ${annee}`;
  }
}
const [isOffline, setIsOffline] = useState(false);
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsOffline(!state.isConnected);
  });
  return () => unsubscribe();
}, []);
// ####################### Local Storage #########################
const local_infoUser = require('../assets/data-user/profile-info.json');

// ################################################

const {height, width} = Dimensions.get('window');
const HEADER_HEIGHT = 48;
const IMAGE_SIZE = width - 40;
type PostImagesProps = {
  profileImage: string;
  name: string;
  date: string;
  IMAGES: Array<any>; // Replace 'any' with the correct type if known, e.g., ImageSourcePropType
  description: string;
  text: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isCommented: boolean;
  postId: number;
};

// ###############################################
export default function Main() {
  // ########### API ###########
    // API_DATA
  const [infoUser, setInfoUser] = useState<any | null>(null);
  const [postRecommandation, setPostRecommandation] = useState<any[] | null>(null);
    // API_FETCH_DATA
  const fetchData = async () => {
      if (isOffline){
        setInfoUser(local_infoUser);
        setPostRecommandation(null);
      }else{
        const info = await API("take-users-informations", local_infoUser.id);
        const posts = await API("take-post-recommandation", local_infoUser.id);
        setInfoUser(info);
        setPostRecommandation(posts);
      }
    };
    // API_EXECUTE
  useEffect(() => {
    fetchData();
  }, []);
  // ########### Theme ###########
  const scheme = useColorScheme();
  const isLight = scheme === 'light';
  const theme = isLight ? LightTheme : DarkTheme;
  // ########### SafeArea ###########
  const insets = useSafeAreaInsets();
  console.log(insets);
  // ########### Post Component ###########
  function Post({ profileImage, name, date, IMAGES, description, text, likes, comments, isLiked, isCommented, postId }: PostImagesProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [liked, setLiked] = useState(isLiked);
    const [likeCount, setLikeCount] = useState(likes);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    // Animated event to handle the scroll position
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
    }).current;
    // Function to handle the like button press
    const toggleLike = () => {
      if (liked) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
        API("delete-like-post", { postId });
      } else {
        setLiked(true);
        setLikeCount(prev => prev + 1);
        API("add-like-post", { postId });
      }
    };
    // ######## Rooter ###########
    const router = useRouter();
    return (
      <View style={[styles.post, { backgroundColor: theme.post }]}>
        {/* Post header */}
        <View style={styles.postHeader}>
          {/* Profile Image */}
          <View style={{ marginRight: 12 }}>
            <View style={styles.profileContainer}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </View>
          </View>
          {/* Name and Date */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.text }}>{name}</Text>
            <Text style={{ color: theme.text, fontSize: 12, marginTop: 2 }}>{formaterDate(date)}</Text>
          </View>
          {/* Icons */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ transform: [{ rotate: '-35deg' }], top: -2 }}>
              <SendIcon color={theme.icon} size={20} />
              </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <GridIcon color={theme.icon} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Post content */}
          {IMAGES.length !==0 ?(
          <View style={styles.postContainerImage}>
            <Animated.FlatList ref={flatListRef} data={IMAGES} keyExtractor={(_, i) => i.toString()} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }} renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item }} style={[styles.image,{ borderRadius: 0 }]} resizeMode="cover" />
                </View>
              )}
            />
            <View style={styles.dotsContainer}>{IMAGES.map((_, i) => (
                <View key={i} style={[styles.dot,{backgroundColor: activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(120,120,120,0.4)',width: activeIndex === i ? 10 : 8,height: activeIndex === i ? 10 : 8}]} />
              ))}
            </View>
          </View>
          ) : (
          <View style={styles.postContainerText}>
            <Text style={[styles.postText, { color: theme.text }]}>{text}</Text>
          </View>
          )}
        {/* Post description */}
        {/* Post actions (likes & comments) */}
        <View style={styles.postActions}>
          {/* Like icon and count */}
          <TouchableOpacity onPress={toggleLike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
            <LikeIcon color={liked ? '#ff0000' : theme.icon} size={24} isLiked={liked} />
            <Text style={[styles.countText, { color: theme.text }]}>{likeCount}</Text>
          </TouchableOpacity>
          {/* Comment icon and count */} 
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CommentIcon color={isCommented ? '#079d25' : theme.icon} size={24} isCommented={isCommented} />
            <Text style={[styles.countText, { color: theme.text }]}>{comments}</Text>
          </TouchableOpacity>
        </View>
        {/* Post description */}
        {IMAGES.length !==0 ? (
        <View style={styles.postDescription}>
          <Text style={[styles.postText, { color: theme.text }]}>
            {description}
          </Text>
        </View>
        ) : null}
      </View>
    );
  }
  // ########### Skeleton Placeholder ###########
  const PlaceholderPost = () => (
    <View style={[styles.post, { backgroundColor: '#ddd' }]}>
      {/* Post header */}
      <View style={styles.postHeader}>
        {/* Profile Image */}
        <View style={{ marginRight: 12 }}>
          <View style={[styles.profileContainer, { backgroundColor: '#bbb' }]} />
        </View>

        {/* Name and Date */}
        <View style={{ flex: 1 }}>
          <View style={{ width: 100, height: 16, backgroundColor: '#bbb', borderRadius: 4 }} />
          <View style={{ width: 60, height: 12, backgroundColor: '#ccc', borderRadius: 4, marginTop: 6 }} />
        </View>

        {/* Icons (Send & Grid) */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#aaa', borderRadius: 4, transform: [{ rotate: '-35deg' }], top: -2 }} />
          <View style={{ width: 20, height: 20, backgroundColor: '#aaa', borderRadius: 4, marginLeft: 16 }} />
        </View>
      </View>

      {/* Post content (image placeholder) */}
      <View style={[styles.postContainerImage, { backgroundColor: '#bbb' }]} />

      {/* Post actions */}
      <View style={styles.postActions}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
          <View style={{ width: 24, height: 24, backgroundColor: '#aaa', borderRadius: 4 }} />
          <View style={[styles.countText, { backgroundColor: '#ccc', width: 30, height: 12, marginLeft: 6, borderRadius: 4 }]} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 24, height: 24, backgroundColor: '#aaa', borderRadius: 4 }} />
          <View style={[styles.countText, { backgroundColor: '#ccc', width: 30, height: 12, marginLeft: 6, borderRadius: 4 }]} />
        </View>
      </View>

      {/* Post description */}
      <View style={styles.postDescription}>
        <View style={{ width: '100%', height: 10, backgroundColor: '#ccc', borderRadius: 4, marginBottom: 6 }} />
        <View style={{ width: '60%', height: 10, backgroundColor: '#ccc', borderRadius: 4 }} />
      </View>
    </View>
  );
  // ########### Refresh Data ###########
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setPostRecommandation([]); // Supprimer les posts actuels (optionnel)
    await fetchData();
    setRefreshing(false);
  };
  // ########### Ready Context ###########
  const { setScreenReady } = useReady();
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [navBarReady, setNavBarReady] = useState(false);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const showNavBar = navBarReady && layoutReady && profileImageLoaded;
  const navBarOpacity = useRef(new Animated.Value(0)).current;
  const [localProfileImageUri, setLocalProfileImageUri] = useState<string | null>(null);
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
  if (!postRecommandation || !infoUser) return;

  let isCancelled = false;

  const preload = async () => {
    try {
      // 1. Précharge l'image de profil en premier
      if (infoUser.profileImage) {
        if(local_infoUser.lastChangeProfileImage == infoUser.lastChangeProfileImage) {
          console.log("Image de profil déjà chargée");
          const extension = infoUser.profileImage.split('.').pop();
          const uri = FileSystem.documentDirectory + 'profile-image.' + extension;
          setLocalProfileImageUri(uri);
          setProfileImageLoaded(true);
        }else{
          console.log("Retéléchargement de l'image de profil");
          const url = infoUser.profileImage;
          const extension = url.split('.').pop();
          const localUri = FileSystem.documentDirectory + 'profile-image.' + extension;
          try {
            const downloadResumable = FileSystem.createDownloadResumable(url, localUri, {});
            const result = await downloadResumable.downloadAsync();
            if (result && result.uri && !isCancelled) {
              setLocalProfileImageUri(result.uri);
              setProfileImageLoaded(true);
            }
          } catch (error) {
            console.warn("Erreur de téléchargement de l'image :", error);
          }
        }
      }

      // 2. Précharge les images des posts
      const postImages = postRecommandation
        .flatMap(post => post.IMAGES ?? [])
        .filter(url => typeof url === 'string');

      if (postImages.length === 0) {
        if (!isCancelled) setImagesPreloaded(true);
        return;
      }

      await Promise.all(postImages.map(url => Image.prefetch(url)));

      if (!isCancelled) setImagesPreloaded(true);
    } catch (error) {
      console.warn("Erreur préchargement images", error);
      if (!isCancelled) {
        setProfileImageLoaded(true); // fallback si erreur
        setImagesPreloaded(true);
      }
    }
  };

  preload();

  return () => {
    isCancelled = true;
    setProfileImageLoaded(false);
    setImagesPreloaded(false);
  };
}, [postRecommandation, infoUser]);

  useEffect(() => {
    if (layoutReady && navBarReady) {
      setScreenReady(true);
    }
  }, [layoutReady, navBarReady]);
  // ########### Render ###########
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
        {!imagesPreloaded ? (
          isOffline ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Image source={require('../assets/images/no-connection.jpg')} style={{ width: 120, height: 120 }} />
              <Text style={{ color: theme.text, marginTop: 8 }}>Pas de connexion internet</Text>
            </View>
          ) : !imagesPreloaded && (
            <>
              <PlaceholderPost />
              <PlaceholderPost />
            </>
          )
        ) : (
          postRecommandation?.map((post, i) => (
            <Post
              key={post.id}
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
            />
          ))
        )}
      </ScrollView>
      {infoUser && (
        <Animated.View style={{ opacity: navBarOpacity }}>
          <NavBar isLight={isLight} imageUser={localProfileImageUri ?? ''} isHome={true} onReady={() => setNavBarReady(true)} />
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