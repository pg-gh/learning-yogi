import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import { colors } from '../utils/colors';

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
    return (
        <View style={styles.wrap} pointerEvents="box-none">
            <EmojiSelector
                onEmojiSelected={onSelect}
                showSearchBar={false}
                showTabs={false}
                columns={8}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        height: 280,
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        zIndex: Platform.OS === 'android' ? 1 : 5,
        elevation: 8,
    },
});
