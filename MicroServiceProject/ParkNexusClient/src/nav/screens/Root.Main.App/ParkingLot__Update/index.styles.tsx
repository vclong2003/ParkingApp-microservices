import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    imageContainer: {
        flexDirection: "row",
        marginBottom: 20,
        minHeight: 100,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },

    formSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    map: {
        height: 400,
        borderRadius: 8,
        overflow: "hidden",
    },
    markerContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    markerDot: {
        width: 20,
        height: 20,
        backgroundColor: "#128085",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    submitButton: {
        marginBottom: 32,
    },
});
