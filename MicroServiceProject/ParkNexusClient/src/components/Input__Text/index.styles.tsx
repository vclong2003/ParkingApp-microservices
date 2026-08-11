import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,

        borderRadius: 12,
        paddingHorizontal: 16,
        height: 40,

        backgroundColor: "rgba(240, 240, 240, 1)",
    },
    textInput: {
        flex: 1,

        fontSize: 14,
        fontWeight: "400",
    },
    error: {
        fontSize: 12,
        fontWeight: "400",
        color: "#e54646",
    },
});
