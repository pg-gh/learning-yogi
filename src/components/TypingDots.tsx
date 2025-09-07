import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function TypingDots() {
    const dots = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];
    useEffect(() => {
        dots.forEach((v, i) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(v, { toValue: 1, duration: 400, useNativeDriver: true, delay: i * 150 }),
                    Animated.timing(v, { toValue: 0, duration: 400, useNativeDriver: true }),
                ]),
            ).start(),
        );
    }, []);

    return (
        <View style={styles.row}>
            {dots.map((v, i) => (
                <Animated.View key={i} style={[styles.dot, { opacity: v }]} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.typingDot },
});
