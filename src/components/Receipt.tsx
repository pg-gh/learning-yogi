import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../utils/colors';
import { ReceiptEnum } from '../types';

export default function Receipt({ state }: { state: ReceiptEnum }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulseAnim.setValue(1);
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
    <Animated.View style={[styles.wrap]}>
      <Text style={[styles.txt, { color }]}>{mark}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginLeft: 8 },
  txt: { color: colors.textSecondary, fontSize: 12 },
});
