import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Message } from '../types';
import { colors } from '../utils/colors';
import Receipt from './Receipt';

export default function MessageBubble({ m }: { m: Message }) {
    const mine = m.role === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <Animated.View
            style={[
                styles.row,
                mine ? styles.right : styles.left,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
        >
            <View
                style={[styles.bubble, { backgroundColor: mine ? colors.userBubble : colors.galeBubble }]}
            >
                <Text style={styles.text}>{m.text}</Text>
                {mine && m.receipt && <Receipt state={m.receipt} />}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: { width: '100%', padding: 4 },
    left: { alignItems: 'flex-start' },
    right: { alignItems: 'flex-end' },
    bubble: { maxWidth: '80%', borderRadius: 18, padding: 10 },
    text: { color: colors.textPrimary, fontSize: 16 },
});
