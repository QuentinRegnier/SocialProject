import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Rect, Line, Defs, Stop, RadialGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SWITCH_WIDTH = 200;
const SWITCH_HEIGHT = 50;
const BUBBLE_MARGIN = 4;
const BUBBLE_WIDTH = (SWITCH_WIDTH / 2) - BUBBLE_MARGIN * 2;

export default function SegmentedSwitch() {
  const [selected, setSelected] = useState<'TEXT' | 'PHOTO'>('PHOTO');
  const offset = useSharedValue(selected === 'PHOTO' ? 1 : 0);

  const handlePress = (type: 'TEXT' | 'PHOTO') => {
    setSelected(type);
    offset.value = withTiming(type === 'PHOTO' ? 1 : 0, { duration: 200 });
  };

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(offset.value * (SWITCH_WIDTH / 2), { duration: 200 }),
      },
    ],
  }));

  const LINE_WIDTH = 4.2; // ici tu règles l'épaisseur des barres
  const LINE_SPACING = LINE_WIDTH * 2.5; // espacement entre les barres, adapté à la largeur
  return (
    <MaskedView
      style={{ width: SWITCH_WIDTH, height: SWITCH_HEIGHT }}
      maskElement={
        <View style={styles.capsule}>
          <Text> </Text>
        </View>
      }
    >
      {/* Background with stripes */}
      <Svg
        width={SWITCH_WIDTH + SWITCH_HEIGHT * 4}
        height={SWITCH_HEIGHT}
      >
        <Rect x="0" y="0" width="100%" height="100%" fill="black" />

        {(() => {
          const r = SWITCH_HEIGHT / 2;
          const tangentOffset = r * (1 + Math.sqrt(2));
          const MAX_WIDTH = 500;
          const lines = [];
          let i = 0;

          while (true) {
            const x1 = i * LINE_SPACING - tangentOffset;
            let x2 = x1 - SWITCH_HEIGHT;

            if (x2 > MAX_WIDTH) break;

            if (x2 > MAX_WIDTH) {
              x2 = MAX_WIDTH;
            }

            lines.push(
              <Line
                key={i}
                x1={x1}
                y1={0}
                x2={x2}
                y2={SWITCH_HEIGHT}
                stroke="rgb(30, 30, 30)"
                strokeWidth={LINE_WIDTH}
              />
            );
            i++;
          }

          return lines;
        })()}
      </Svg>

      {/* Bubble */}
      <Animated.View style={[styles.bubble, bubbleStyle]}>
        <MaskedView
          style={{ flex: 1 }}
          maskElement={<View style={styles.bubbleShapeMask} />}
        >
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient
                id="grad"
                cx="50%"
                cy="50%"
                rx="70%"   // augmente la largeur du gradient radial
                ry="50%"   // hauteur du gradient radial (moitié du rect)
                fx="50%"
                fy="50%"
              >
                <Stop offset="0%" stopColor="rgb(45, 45, 45)" />
                <Stop offset="100%" stopColor="rgb(20, 20, 20)" />
              </RadialGradient>
            </Defs>
            <Rect
              width="100%"
              height="100%"
              fill="url(#grad)"
              rx={(SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2}
              ry={(SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2}
            />
            <Rect
              width="100%"
              height="100%"
              rx={(SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2}
              ry={(SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2}
              fill="none"
              stroke="#888" // couleur de la bordure (à adapter si besoin)
              strokeWidth="2" // très fine
            />
          </Svg>
        </MaskedView>
 
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonArea} onPress={() => handlePress('TEXT')}>
          <Text style={[styles.buttonText, selected === 'TEXT' && styles.selectedText]}>TEXT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonArea} onPress={() => handlePress('PHOTO')}>
          <Text style={[styles.buttonText, selected === 'PHOTO' && styles.selectedText]}>PHOTO</Text>
        </TouchableOpacity>
      </View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  capsule: {
    backgroundColor: 'black',
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
  },
  buttonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  buttonArea: {
    width: SWITCH_WIDTH / 2,
    height: SWITCH_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  selectedText: {
    color: 'yellow',
  },
  bubble: {
  position: 'absolute',
  top: BUBBLE_MARGIN,
  left: BUBBLE_MARGIN,
  width: BUBBLE_WIDTH,
  height: SWITCH_HEIGHT - BUBBLE_MARGIN * 2,
  borderRadius: (SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2,
  backgroundColor: 'transparent', // on supprime la couleur fixe
  zIndex: 0,
},

bubbleBorder: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: (SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2,
  overflow: 'hidden',
  zIndex: -1,
},

bubbleShapeMask: {
  backgroundColor: 'black',
  borderRadius: (SWITCH_HEIGHT - BUBBLE_MARGIN * 2) / 2,
  width: BUBBLE_WIDTH,
  height: SWITCH_HEIGHT - BUBBLE_MARGIN * 2,
},
});