import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet, Dimensions, InteractionManager } from 'react-native';
import LikeIcon from '@/assets/icons/LikeIcon';
import CommentIcon from '@/assets/icons/CommentIcon';
import SendIcon from '@/assets/icons/SendIcon';
import GridIcon from '@/assets/icons/GridIcon';
import { formaterDate } from '@/utils/formaterDate';
import { API } from '@/utils/API';
import { IconNormal } from '@/assets/icons/Icon';
import PostImage from '@/components/PostImage';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 100;

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
  onReady?: () => void;
}

const Post: React.FC<PostProps> = ({ profileImage, name, date, IMAGES, description, text, likes, comments, isLiked, isCommented, postId, theme, onReady }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    InteractionManager.runAfterInteractions(() => {
      if (liked) {
        API("delete-like-post", { postId });
      } else {
        API("add-like-post", { postId });
      }
    });
  };
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;
  useEffect(() => {
    if (onReady) {
      const timeout = setTimeout(() => {
        onReady();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, []);
  return (
    <View style={[styles.post, { flexDirection: 'row', alignItems: 'flex-start' }]}>
      {/* Colonne 1 : Image de profil */}
      <View style={styles.profileColumn}>
        <PostImage
          source={profileImage}
          index={0}
          style={styles.profileImage}
          placeholderColor={theme.placeholderPrimary}
        />
      </View>

      {/* Colonne 2 : Le reste du post */}
      <View style={styles.contentColumn}>
        {/* Header avec pseudo + icônes */}
        <View style={styles.postHeader}>
          <Text style={[styles.nameText, { color: theme.pseudoPost }]}>{name}</Text>
          <View style={styles.iconGroup}>
            <TouchableOpacity>
              <IconNormal NAME="share" ICON_SIZE={20} IS_IOS={false} IS_LIGHT={theme.background === '#eeeeee'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <IconNormal NAME="burger" ICON_SIZE={20} IS_IOS={false} IS_LIGHT={theme.background === '#eeeeee'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date */}
        <Text style={[styles.dateText, { color: theme.datePost }]}>{formaterDate(date)}</Text>

        {/* Description */}
        {IMAGES.length > 0 && (
          <View style={styles.postDescription}>
            <Text style={[styles.postText, { color: theme.textPost }]}>{description}</Text>
          </View>
        )}
        
        {/* Contenu image ou texte */}
        {IMAGES.length > 0 ? (
          <View style={styles.postContainerImage}>
            <Animated.FlatList
              ref={flatListRef}
              data={IMAGES}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item + '-' + index}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              removeClippedSubviews={true}
              windowSize={2}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
              renderItem={({ item, index }) => (
                <View style={styles.imageWrapper}>
                  <PostImage
                    source={item}
                    index={index + 1}
                    style={styles.image}
                    placeholderColor={theme.placeholderPrimary}
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
          <View style={styles.postContainerText}>
            <Text style={[styles.postText, { color: theme.textPost }]}>{text}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity onPress={toggleLike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
            <LikeIcon color={liked ? '#ff0000' : theme.icon} size={24} isLiked={liked} />
            <Text style={[styles.countText, { color: theme.text }]}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CommentIcon color={isCommented ? '#079d25' : theme.icon} size={24} isCommented={isCommented} />
            <Text style={[styles.countText, { color: theme.text }]}>{comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    margin: 0,
    paddingBottom: 16,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#7f7f7f',
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
    marginBottom: 4,
    marginTop: 2,
  },
  countText: {
    marginLeft: 6,
    fontSize: 15,
  },
  postDescription: {
    width: IMAGE_SIZE,
    marginTop: 4,
  },
  postText: {
    fontSize: 15,
    textAlign: 'justify',
  },
  profileColumn: {
    width: 60, // largeur fixe pour l'image profil + un peu de marge
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentColumn: {
    flex: 1,
    paddingRight: 16,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 8,
  },
});

export default React.memo(Post);