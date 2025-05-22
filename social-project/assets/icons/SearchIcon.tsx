import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SearchIcon = ({ size = 24, color = '#000', strokeWidth = 1.5 }) => (
  <Svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke={color}
    fill="none"
    strokeWidth={strokeWidth}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </Svg>
);

export default SearchIcon;