import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../utils/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

export default function DashboardScreen({
    navigation,
}: NativeStackScreenProps<RootStackParamList, 'Dashboard'>) {
    return (
        <View style={styles.wrap}>
            <Pressable onPress={() => navigation.navigate('Chat')} style={styles.card}>
                <Text style={styles.cardTitle}>Chat to Gale</Text>
                <Text style={styles.cardSubtitle}>Get support and guidance from your PDA expert</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
    card: {
        marginTop: 24,
        backgroundColor: colors.card,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 16,
        width: '88%',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    cardTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 6 },
    cardSubtitle: { color: colors.textSecondary, fontSize: 14 },
});
