import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
    sectionWrapper: {
        marginTop: 16,
        padding: 14,
        borderRadius: 8,
        backgroundColor: "#f7f7f7",
        shadowRadius: 4,
    },
    sectionTitleWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3c3c3c",
        marginBottom: 8,
    },
    editBtn: {
        width: 48,
        height: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
        marginTop: 8,
        marginBottom: 1,
    },
    text: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    image: {
        aspectRatio: 3 / 2,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    itemContainer: {
        padding: 12,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        marginRight: 8,
    },
    scrollContainer: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    button: {
        marginLeft: 8,
        backgroundColor: "#ccc",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
});
