import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const globalStyles = StyleSheet.create({
  
    circle1: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#BFE5FF',
    borderRadius: (width * 0.6) / 2,
    position: 'absolute',
    top: height * -0.25,
    left: width * -0.1,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#C5FF93',
    borderRadius: (width * 0.6) / 2,
    position: 'absolute',
    top: height * -0.25,
    right: width * -0.1,
  },
  circle3: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#BFE5FF',
    borderRadius: (width * 0.6) / 2,
    position: 'absolute',
    bottom: height * -0.25,
    left: width * -0.1,
  },
  circle4: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#C5FF93',
    borderRadius: (width * 0.6) / 2,
    position: 'absolute',
    bottom: height * -0.25,
    right: width * -0.1,
  },
});
export default globalStyles;