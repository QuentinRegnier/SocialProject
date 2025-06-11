import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SFSymbol } from 'react-native-sfsymbols';
import { LightTheme, DarkTheme } from '@/constants/Colors';

const getIconName = (type: 'home' | 'search' | 'post' | 'chat' | 'profile', isIOS: boolean) => {
  const iosIcons = {
    home: 'house',
    search: 'magnifying-glass',
    post: 'plus-circle',
    chat: 'bubble-left-right',
    profile: 'person.crop.circle',
  };
  const androidIcons = {
    home: 'home',
    search: 'search',
    post: 'add-circle',
    chat: 'chat',
    profile: 'account-circle',
  };
  return isIOS ? iosIcons[type] : androidIcons[type];
};

interface IconNavBarProps {
  ICON_SIZE: number;
  NAME: 'home' | 'search' | 'post' | 'chat' | 'profile'; // Type des icônes
  IS_ACTIVE: boolean;
  IS_IOS: boolean;
  IS_LIGHT: boolean; // Optionnel pour le thème clair
  NO_TEXT?: boolean; // Optionnel pour ne pas afficher le texte
  URI?: string; // Optionnel pour une image utilisateur
}
const IconNavBar: React.FC<IconNavBarProps> = ({ ICON_SIZE, NAME, IS_ACTIVE, IS_IOS, IS_LIGHT, NO_TEXT, URI }) => {
    const theme = IS_LIGHT ? LightTheme : DarkTheme;
    const textValue = {
        home: 'Home',
        search: 'Search',
        post: 'Post',
        chat: 'Chat',
        profile: 'Profile',
    }
    return (
        <View style={[styles.iconContainer, { width: ICON_SIZE + (NO_TEXT ? 0 : 4), height: ICON_SIZE + (NO_TEXT ? 0 : 10) }]}>
        {URI ? (
            <Image source={{ uri: URI }} style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }} />
        ) : IS_IOS ? (
            <SFSymbol
                name={getIconName(NAME, IS_IOS)}
                style={{ width: ICON_SIZE, height: ICON_SIZE }}
                color={IS_ACTIVE ? theme.activeIcon : theme.icon}
                weight="regular"
                scale="medium"
                multicolor={false}
            />
            ) : (
            <MaterialIcons
                name={getIconName(NAME, IS_IOS) as React.ComponentProps<typeof MaterialIcons>['name']}
                size={ICON_SIZE}
                color={IS_ACTIVE ? theme.activeIcon : theme.icon}
            />
        )}
        {!NO_TEXT && (
            <Text style={[styles.iconLabel, { color: theme.textIcon }]}>{textValue[NAME]}</Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconLabel: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '500',
    },
});

export default IconNavBar;