// components/CustomText.js
import React, { useContext } from 'react';
import { Text } from 'react-native';
import { FontSizeContext } from '../context/FontSizeContext';

const CustomText = ({ style, children, ...props }) => {
  const { fontSize } = useContext(FontSizeContext);

  return (
    <Text {...props} style={[style, { fontSize }]}>
      {children}
    </Text>
  );
};

export default CustomText;
