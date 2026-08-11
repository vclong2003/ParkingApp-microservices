import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingVertical: 8,

        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFF",
    },

    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",

        textAlign: "center",
    },

    buttonWrapper: {
        flex: 1,
        width: 25,
        height: 25,
    },
});
