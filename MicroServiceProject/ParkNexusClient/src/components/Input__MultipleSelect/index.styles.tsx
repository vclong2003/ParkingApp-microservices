import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "column",
        gap: 6,
    },

    selectedOptionsWrapper: {
        width: "100%",
    },
    selectedOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 6,
        backgroundColor: "#128085",
        borderRadius: 6,
        marginRight: 6,
    },
    selectedOptionText: {
        fontSize: 14,
        color: "#FFF",
    },

    optionsWrapper: {
        width: "100%",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 6,
        marginRight: 6,
    },
    optionText: {
        fontSize: 14,
        color: "#5A5555",
    },
});
