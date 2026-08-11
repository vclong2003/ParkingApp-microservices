import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    cardInfo: {flex: 1},
    cardText: {fontSize: 14, fontWeight: '600', color: '#555555', marginBottom: 4},
    trashButton: {
        width: 32,
        height: 32,
    },
});
