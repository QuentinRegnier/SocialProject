import React, { useState } from 'react';
import { View, StyleSheet, InteractionManager, Animated } from 'react-native';
import { Image } from 'expo-image';

interface PostImageProps {
    source: string;
    index: number;
    style?: object;
    placeholderColor?: string;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const PostImage: React.FC<PostImageProps> = ({source,index,style,placeholderColor,}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <Image
        source={source}
        style={style}
        contentFit="cover"
        onLoad={() => {
          InteractionManager.runAfterInteractions(() => {
            setLoaded(true);
          });
        }}
      />
      {!loaded && (
        <View style={[StyleSheet.absoluteFill, style, { backgroundColor: placeholderColor }]} />
      )}
    </>
  );
};
export default React.memo(PostImage);