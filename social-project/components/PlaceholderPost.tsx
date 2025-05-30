import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/Colors'; // ajuste le chemin si besoin

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 40;

interface PlaceholderPostProps {
  isImage: boolean;
  isVisible: boolean;
}

const PlaceholderPost: React.FC<PlaceholderPostProps> = ({ isImage, isVisible }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <View 
      style={[
        styles.post, 
        { 
          backgroundColor: theme.placeholderTertiary,
        },
        !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }
      ]}
    >
      {/* Header */}
      <View style={[
        styles.postHeader,
        !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }
      ]}>
        {/* Profile Image Placeholder */}
        <View style={{ marginRight: 12 }}>
          <View style={[
            styles.profileContainer, 
            { backgroundColor: theme.placeholderPrimary },
            !isVisible && {
              opacity: 0,
              height: 0,
              overflow: 'hidden',
              margin: 0,
              padding: 0,
            }
          ]} />
        </View>
        {/* Name & Date Placeholder */}
        <View style={{ flex: 1 }}>
          <View style={{ width: 100, height: 16, backgroundColor: theme.placeholderPrimary, borderRadius: 4 }} />
          <View style={{ width: 60, height: 12, backgroundColor: theme.placeholderSecondary, borderRadius: 4, marginTop: 6 }} />
        </View>
        {/* Icons Placeholder */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 20, height: 20, backgroundColor: theme.placeholderSecondary, borderRadius: 4, transform: [{ rotate: '-35deg' }], top: -2 }} />
          <View style={{ width: 20, height: 20, backgroundColor: theme.placeholderSecondary, borderRadius: 4, marginLeft: 16 }} />
        </View>
      </View>

      {/* Image Placeholder */}
      {isImage ? (
        <View style={[
          styles.postContainerImage, 
          { backgroundColor: theme.placeholderPrimary },
          !isVisible && {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }
        ]} />
      ) : (
        <View style={[
          styles.postDescription,
          !isVisible && {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }
        ]}>
          <View style={{ width: '100%', height: 10, backgroundColor: theme.placeholderSecondary, borderRadius: 4, marginBottom: 6 }} />
          <View style={{ width: '60%', height: 10, backgroundColor: theme.placeholderSecondary, borderRadius: 4 }} />
        </View>
      )}

      {/* Actions Placeholder */}
      <View style={[
        styles.postActions,
        !isVisible && {
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }
      ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
          <View style={{ width: 24, height: 24, backgroundColor: theme.placeholderSecondary, borderRadius: 4 }} />
          <View style={[styles.countText, { backgroundColor: theme.placeholderSecondary, width: 30, height: 12, marginLeft: 6, borderRadius: 4 }]} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 24, height: 24, backgroundColor: theme.placeholderSecondary, borderRadius: 4 }} />
          <View style={[styles.countText, { backgroundColor: theme.placeholderSecondary, width: 30, height: 12, marginLeft: 6, borderRadius: 4 }]} />
        </View>
      </View>

      {/* Description Placeholder */}
      {isImage && (
        <View style={[
          styles.postDescription,
          !isVisible && {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }
        ]}>
          <View style={{ width: '100%', height: 10, backgroundColor: theme.placeholderSecondary, borderRadius: 4, marginBottom: 6 }} />
          <View style={{ width: '60%', height: 10, backgroundColor: theme.placeholderSecondary, borderRadius: 4 }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    margin: 10,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingBottom: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainerImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
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
});

export default PlaceholderPost;