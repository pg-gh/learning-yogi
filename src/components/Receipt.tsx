import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../utils/colors';
import { ReceiptEnum } from '../types';

export default function Receipt({ state }: { state: ReceiptEnum }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'read') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [state, pulseAnim]);

  const getMark = (state: ReceiptEnum): string => {
    switch (state) {
      case 'sending':
        return '•';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '✓✓';
    }
  };

  const getColor = (state: ReceiptEnum): string => {
    switch (state) {
      case 'sending':
        return colors.textSecondary;
      case 'sent':
        return colors.textSecondary;
      case 'delivered':
        return colors.textSecondary;
      case 'read':
        return colors.readBlue;
      default:
        return colors.textSecondary;
    }
  };

  const mark = getMark(state);
  const color = getColor(state);

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ scale: state === 'read' ? pulseAnim : 1 }] }]}
    >
      <Text style={[styles.txt, { color }]}>{mark}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginLeft: 8 },
  txt: { color: colors.textSecondary, fontSize: 12 },
});
