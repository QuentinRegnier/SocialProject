import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
//import HomeIcon from '../assets/icons/home.svg';
//import SearchIcon from '../assets/icons/search.svg';
//import ProfileIcon from '../assets/icons/profile.svg';
import { LightTheme, DarkTheme } from '@/constants/Colors';

const { width } = Dimensions.get('window');
export const TAB_BAR_HEIGHT = 100;
const TAB_BAR_RADIUS = 36;

interface NavBarProps {
  isLight: boolean; // true = light mode, false = dark mode
}

const NavBar: React.FC<NavBarProps> = ({ isLight }) => {
  const theme = isLight ? LightTheme : DarkTheme;
  return (
    <View style={styles.container}>
    {/* <TouchableOpacity style={[styles.container, { backgroundColor: theme.navBar }]}>
      <HomeIcon width={28} height={28} stroke={theme.icon} />
    </TouchableOpacity> */}
    {/* <TouchableOpacity style={styles.iconContainer}>
        <SearchIcon width={28} height={28} stroke={theme.icon} />
      </TouchableOpacity> */}
    {/* <TouchableOpacity style={styles.iconContainer}>
        <ProfileIcon width={28} height={28} stroke={theme.icon} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: TAB_BAR_RADIUS,
    borderTopRightRadius: TAB_BAR_RADIUS,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 100,
  },
  iconContainer: {
    padding: 10,
  },
});

export default NavBar;