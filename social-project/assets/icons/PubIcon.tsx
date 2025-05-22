import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const AddRoundedIcon = ({ size = 24, color = '#000', strokeWidth = 1.5 }) => (
  <Svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke={color}
    fill="none"
    strokeWidth={strokeWidth}
  >
    {/* Rectangle arrondi au lieu d'un cercle */}
    <Rect
      x={3}
      y={3}
      width={18}
      height={18}
      rx={9} // rayon horizontal
      ry={9} // rayon vertical
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Le plus au centre */}
    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
  </Svg>
);

export default AddRoundedIcon;