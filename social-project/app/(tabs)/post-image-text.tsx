import React, { use, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, PanResponder, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useReady } from '@/components/ReadyContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS, useAnimatedStyle, useAnimatedReaction } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SegmentedSwitch from '@/components/SegmentedSwitchPostCreator';
import { IconNormal } from '@/assets/icons/Icon';

type Props = {
  preload?: boolean;
};

export default function PostImageText({ preload }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const cameraRef = useRef<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { setPageReady } = useReady();
  const [zoom, setZoom] = useState(0); // x0.5
  const [sliderWidth, setSliderWidth] = useState(250); // largeur du slider
  const sliderOffset = useSharedValue(0); // position de la bulle (0 à 1)
  const [sliderZoom, setSliderZoom] = useState(0);
  const [lastPhotoUri, setLastPhotoUri] = useState<string | null>(null);
  // ########### SafeArea ###########
  const insets = useSafeAreaInsets();

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  useEffect(() => {
    if (facing === 'back') {
      setZoom(0.0625);
      sliderOffset.value = 0.5;
    } else {
      setZoom(0);
      sliderOffset.value = 0;
    }
  }, [facing]);

  useEffect(() => {
    console.log('zoom changed:', zoom);
  }, [zoom]);
  const computeCameraZoom = (zoom: number): number => {
    const maxZoom = 0.05; // valeur maximale acceptée par CameraView (peut être < 1 selon appareil)
    return zoom * maxZoom;
  };
  
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 1,
          sortBy: [['creationTime', false]],
        });

        if (media.assets.length > 0) {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(media.assets[0].id);
          setLastPhotoUri(assetInfo.localUri || assetInfo.uri); // `localUri` est prioritaire
        }
      }
    })();
  }, []);

  const computeVisualZoom = (zoom: number): number => {
    let minX, maxX: number;
    if (facing == 'back') {
      minX = 0.5;
      maxX = 4;
    } else {
      minX = 1;
      maxX = 2;
    }
    return Math.round((minX * Math.exp(Math.log(maxX) * zoom)) * 10) / 10;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const scaleDelta = e.scale - 1;
      const newZoom = Math.min(Math.max(zoom + scaleDelta * 0.01, 0), 1);
      runOnJS(setZoom)(newZoom);
      sliderOffset.value = newZoom;
    });

  const startOffset = useSharedValue(0);

  const sliderGesture = Gesture.Pan()
    .onBegin(() => {
      startOffset.value = sliderOffset.value;
    })
    .onUpdate((e) => {
      const deltaRatio = e.translationX / sliderWidth;
      const result = Math.min(Math.max(startOffset.value + deltaRatio, 0), 1);
      sliderOffset.value = result;
      runOnJS(setZoom)(result);
    });
  const animatedThumbStyle = useAnimatedStyle(() => ({
      left: `${sliderOffset.value * 100}%`,
  }));
  useEffect(() => {
      setPageReady('post-image-text', true);
  }, []);
  if (preload) return null;
  useAnimatedReaction(
    () => sliderOffset.value,
    (current) => {
      runOnJS(setSliderZoom)(current);
    },
    []
  );
  // 🟨 Rendu conditionnel APRÈS les hooks
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permission caméra requise</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1, // qualité maximale
        skipProcessing: false, // conserve la stabilisation si dispo
      });
      setImageUri(photo.uri);
    }
  };
  return (
    <View style={styles.container}>
      {/* Barre noire top */}
      <View style={{ backgroundColor: 'black', height: insets.top }} />

      {/* Zone caméra */}
      <GestureDetector gesture={pinchGesture}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={facing}
            ref={cameraRef}
            zoom={computeCameraZoom(zoom)}
          />

          {/* Gradient haut */}
          <LinearGradient
            colors={['#000', 'rgba(0,0,0,0.8)']}
            style={styles.topGradient}
          >
            <TouchableOpacity style={styles.crossButton} onPress={() => router.back()}>
              <IconNormal NAME="cross" ICON_SIZE={24} IS_IOS={false} IS_LIGHT={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.hamburgerButton}>
              <IconNormal NAME="burger" ICON_SIZE={24} IS_IOS={false} IS_LIGHT={false} />
            </TouchableOpacity>
          </LinearGradient>

          {/* Preview image de debug */}
          {imageUri && (
            <View style={styles.preview}>
              <Text style={styles.previewText}>Image :</Text>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Slider zoom */}
          <View style={styles.zoomSliderContainer}>
            <Text style={styles.zoomText}>{computeVisualZoom(sliderZoom)}x</Text>
            <View
              style={styles.sliderTrack}
              onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            >
              <GestureDetector gesture={sliderGesture}>
                <Animated.View style={[styles.sliderThumb, animatedThumbStyle]} />
              </GestureDetector>
            </View>
          </View>

          {/* Gradient bas */}
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', '#000']}
            style={styles.bottomGradient}
          >
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.innerCaptureButton} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </GestureDetector>

      {/* Barre noire bottom */}
      <View style={[styles.bottomBar, { height: insets.bottom + 70 }]}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          {lastPhotoUri ? (
            <Image source={{ uri: lastPhotoUri }} style={styles.galleryThumbnail} />
          ) : (
            <IconNormal NAME="photo_gallery" ICON_SIZE={50} IS_IOS={false} IS_LIGHT={false} />
          )}
        </TouchableOpacity>

        <SegmentedSwitch />

        <TouchableOpacity style={styles.galleryButton} onPress={toggleFacing}>
          <IconNormal NAME="flip_camera" ICON_SIZE={50} IS_IOS={false} IS_LIGHT={false} />
        </TouchableOpacity>
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    height: 90,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossButton: {
    padding: 10,
  },
  hamburgerButton: {
    padding: 10,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomSliderContainer: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  zoomText: {
    color: 'white',
    marginBottom: 5,
    fontSize: 16,
  },
  sliderTrack: {
    width: 250,
    height: 4,
    backgroundColor: '#ffffff50',
    borderRadius: 2,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    top: -10,
    marginLeft: -12,
  },
  captureButton: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  bottomBar: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  galleryButton: {
    backgroundColor: '#00000080',
    borderRadius: 30,
  },
  preview: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    right: 20,
    backgroundColor: '#000000aa',
    borderRadius: 10,
    padding: 10,
  },
  previewText: {
    color: 'white',
    marginBottom: 5,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    textAlign: 'center',
    margin: 10,
  },
  permissionButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  galleryThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
});