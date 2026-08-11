import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    lotListWrapper: {
        flex: 1,
        paddingHorizontal: 16,
    },
    lotItem: {
        padding: 14,
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        marginVertical: 8,
    },
    lotName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#128085",
        marginBottom: 8,
    },
    lotDetails: {
        fontSize: 12,
        color: "#666",
    },
    lotStatus: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 6,
    },
    approvedStatus: {
        color: "#1ab653",
    },
    pendingStatus: {
        color: "#d48600",
    },
});
