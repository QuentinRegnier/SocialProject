import React from 'react';
import Svg, { Path } from 'react-native-svg';
interface HomeIconProps {
  size?: number;
  color?: string;
  isHome?: boolean;
}
const HomeIcon = ({ size = 24, color = '#000', isHome = false }: HomeIconProps) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill={isHome ? color : 'none'} stroke={color}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
    />
  </Svg>
);

export default HomeIcon;