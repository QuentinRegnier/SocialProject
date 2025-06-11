import React, { use, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, PanResponder } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useReady } from '@/components/ReadyContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS, useAnimatedStyle, useAnimatedReaction } from 'react-native-reanimated';

type Props = {
  preload?: boolean;
};

export default function PostImageText({ preload }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const cameraRef = useRef<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { prevPage } = useLocalSearchParams();
  const { setPageReady } = useReady();
  const [zoom, setZoom] = useState(0); // x0.5
  const [sliderWidth, setSliderWidth] = useState(250); // largeur du slider
  const sliderOffset = useSharedValue(0); // position de la bulle (0 à 1)
  const [sliderZoom, setSliderZoom] = useState(0);
  
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
      <GestureDetector gesture={pinchGesture}>
        <View style={StyleSheet.absoluteFill}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={facing}
            ref={cameraRef}
            zoom={computeCameraZoom(zoom)}
          />
        </View>
      </GestureDetector>
      <TouchableOpacity
        style={styles.arrowForwardButton}
        onPress={() => {
          const safePrevPage = Array.isArray(prevPage) ? prevPage[0] : prevPage;
          if (safePrevPage) {
            router.replace(safePrevPage as any); // ou typage plus strict si tu connais tes routes
          }
        }}
      >
        <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.zoomSliderContainer}>
        <Text style={styles.zoomText}>{computeVisualZoom(sliderZoom)}x</Text>

        <View
          style={styles.sliderTrack}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            console.log('Slider width:', w);
            setSliderWidth(w);
          }}
        >
          <GestureDetector gesture={sliderGesture}>
            <Animated.View style={[styles.sliderThumb, animatedThumbStyle]} />
          </GestureDetector>
        </View>
      </View>
      <View style={styles.controls}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={() => console.log('Texte')}>
            <MaterialIcons name="text-fields" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity style={styles.switchCameraButton} onPress={toggleFacing}>
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.innerCaptureButton} />
          </TouchableOpacity>
        </View>
      </View>

      {imageUri && (
        <View style={styles.preview}>
          <Text style={styles.previewText}>Image :</Text>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      )}
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#00000080',
    padding: 10,
    borderRadius: 30,
  },
  captureButton: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'gray',
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
  preview: {
    position: 'absolute',
    bottom: 120,
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
  zoomSliderContainer: {
    position: 'absolute',
    bottom: 200,
    width: '100%',
    alignItems: 'center',
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
  switchCameraButton: {
    backgroundColor: '#00000080',
    padding: 10,
    borderRadius: 30,
  },
  arrowForwardButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#00000080',
    padding: 10,
    borderRadius: 20,
  },
});