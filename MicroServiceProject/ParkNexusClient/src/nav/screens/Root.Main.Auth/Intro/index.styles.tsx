import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        alignItems: 'center',

        paddingHorizontal: 16,
    },

    title: {
        fontSize: 40,
        fontWeight: '700',
        color: 'rgba(18, 128, 133, 1)',
    },

    button: {
        backgroundColor: 'rgba(240, 240, 240, 1)',
        borderRadius: 6,
        width: '100%',
    },

    dividerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,

        marginBottom: 16,
        marginTop: 42,
    },
    dividerText: {
        fontSize: 14,
        fontWeight: '400',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#9F9C9C',
    },
});
