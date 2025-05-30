import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LikeIcon from '../assets/icons/LikeIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import SendIcon from '../assets/icons/SendIcon';
import GridIcon from '../assets/icons/GridIcon';
import { formaterDate } from '@/utils/formaterDate';
import { API } from '@/utils/API';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 40;

interface PostProps {
  profileImage: string;
  name: string;
  date: string;
  IMAGES: string[];
  description: string;
  text: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isCommented: boolean;
  postId: number;
  theme: any;
  onReady?: (postId: number) => void;
  isVisible?: boolean;
}

const Post: React.FC<PostProps> = ({ profileImage, name, date, IMAGES, description, text, likes, comments, isLiked, isCommented, postId, theme, onReady, isVisible }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const totalImagesToLoad = 1 + IMAGES.length; // 1 pour l'image profil + images du post
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const loadedImagesRef = useRef(new Set<number>());
  const [isMounted, setIsMounted] = useState(false);
  const [hasNotifiedReady, setHasNotifiedReady] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const onImageLoad = (index: number) => {
    if (!loadedImagesRef.current.has(index)) {
      loadedImagesRef.current.add(index);
      setImagesLoadedCount(c => c + 1);
    }
  };
  useEffect(() => {
    if (isMounted && hasLayout && imagesLoadedCount === totalImagesToLoad && !hasNotifiedReady) {
      setHasNotifiedReady(true);
      onReady?.(postId);
    }
  }, [isMounted, hasLayout, imagesLoadedCount, totalImagesToLoad]);
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

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;

  return (
    <View 
      onLayout={() => setHasLayout(true)}
      style={[
        styles.post,
        {
          backgroundColor: theme.post,
          opacity: isVisible ? 1 : 0,
          height: isVisible ? 'auto' : 0,
          overflow: 'hidden',
          margin: isVisible ? 10 : 0,
          paddingBottom: isVisible ? 16 : 0,
          paddingTop: isVisible ? 0 : 0,
          paddingHorizontal: isVisible ? 0 : 0,
          borderRadius: isVisible ? 10 : 0,
        },
        !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {/* Header */}
      <View style={[styles.postHeader, !isVisible && {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }]}>
        <View style={[{ marginRight: 12 }, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <View style={[styles.profileContainer, !isVisible && {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }]}>
            <Image
              source={profileImage}
              style={styles.profileImage}
              contentFit="cover"
              onLoad={() => onImageLoad(0)}
            />
          </View>
        </View>
        <View style={[{ flex: 1 }, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.text }}>{name}</Text>
          <Text style={{ color: theme.text, fontSize: 12, marginTop: 2 }}>{formaterDate(date)}</Text>
        </View>
        <View style={[{ flexDirection: 'row', alignItems: 'center' }, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <TouchableOpacity style={{ transform: [{ rotate: '-35deg' }], top: -2 }}>
            <SendIcon color={theme.icon} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <GridIcon color={theme.icon} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {IMAGES.length > 0 ? (
        <View style={[styles.postContainerImage, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <Animated.FlatList
            ref={flatListRef}
            data={IMAGES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
            renderItem={({ item, index }) => (
              <View style={[styles.imageWrapper, !isVisible && {
                opacity: 0,
                height: 0,
                overflow: 'hidden',
                margin: 0,
                padding: 0,
              }]}>
                <Image
                  source={item}
                  style={styles.image}
                  contentFit="cover"
                  onLoad={() => onImageLoad(index + 1)} 
                />
              </View>
            )}
          />
          <View style={styles.dotsContainer}>
            {IMAGES.map((_, i) => (
              <View key={i} style={[
                styles.dot,
                {
                  backgroundColor: activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(120,120,120,0.4)',
                  width: activeIndex === i ? 10 : 8,
                  height: activeIndex === i ? 10 : 8
                }
              ]} />
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.postContainerText, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <Text style={[styles.postText, { color: theme.text }]}>{text}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={[styles.postActions, !isVisible && {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }]}>
        <TouchableOpacity onPress={toggleLike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
          <LikeIcon color={liked ? '#ff0000' : theme.icon} size={24} isLiked={liked} />
          <Text style={[styles.countText, { color: theme.text }]}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CommentIcon color={isCommented ? '#079d25' : theme.icon} size={24} isCommented={isCommented} />
          <Text style={[styles.countText, { color: theme.text }]}>{comments}</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {IMAGES.length > 0 && (
        <View style={[styles.postDescription, !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }]}>
          <Text style={[styles.postText, { color: theme.text }]}>{description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    // margin: 10, // removed for dynamic style
    // paddingBottom: 16, // removed for dynamic style
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
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
  postContainerImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  postContainerText: {
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
    borderRadius: 0,
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
  postDescription: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  postText: {
    fontSize: 15,
    textAlign: 'justify',
  },
});

export default Post;