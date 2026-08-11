import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        zIndex: 1,
        left: 20,
        right: 20,

        backgroundColor: 'rgba(11, 10, 10, 0.25)',

        padding: 16,
        borderRadius: 12,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    textInput: {
        color: '#128085',
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        height: 20,
    },

    suggestions: {
        position: 'absolute',
        zIndex: 2,

        left: 20,
        right: 20,

        backgroundColor: 'rgba(11, 10, 10, 0.25)',

        padding: 16,
        borderRadius: 12,
    },
});
