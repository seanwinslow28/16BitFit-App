import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {PixelText} from '../../atoms';
import {colors} from '../../../design-system';

export interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  backgroundColor?: string;
  strokeLinecap?: 'round' | 'square' | 'butt';
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  label,
  color = colors.text.secondary,
  backgroundColor = colors.button.primary,
  strokeLinecap = 'round',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap={strokeLinecap}
          />
        </G>
      </Svg>
      {label && (
        <View style={styles.labelContainer}>
          <PixelText variant="caption" style={styles.label}>
            {label}
          </PixelText>
          <PixelText variant="body" style={styles.percentage}>
            {Math.round(progress * 100)}%
          </PixelText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  percentage: {
    fontSize: 12,
    color: colors.text.primary,
  },
});

export {ProgressRing};
export default ProgressRing;
