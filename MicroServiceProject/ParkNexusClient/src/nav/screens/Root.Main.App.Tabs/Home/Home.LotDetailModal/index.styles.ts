import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        paddingTop: 0,
    },

    pill: {
        backgroundColor: '#d7d7d7',
        width: 50,
        height: 4,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleItemWrapper: {
        flexDirection: 'column',
        gap: 4,
        maxWidth: '80%',
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
    },
    subTitleText: {
        color: '#5A5555',
        fontSize: 14,
        fontWeight: '400',
        maxWidth: 180,
    },

    summaryWrapper: {
        flexDirection: 'row',
        gap: 24,
        marginVertical: 16,
    },
    summaryItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5A5555',
    },

    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    servicesWrapper: {
        flexDirection: 'row',
        gap: 8,
    },
    detailButton: {
        paddingRight: 0,
    },
    detailButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
