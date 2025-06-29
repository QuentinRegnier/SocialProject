import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SendIcon = ({ size = 24, color = '#000', strokeWidth = 1.5 }) => (
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
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </Svg>
);

export default SendIcon;