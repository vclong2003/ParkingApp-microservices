import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    vehicleWrapper: {
        flexDirection: "row",
        backgroundColor: "#eeeeee",
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
    },

    vehicleTextsWrapper: {
        gap: 4,
        flex: 1,
        marginLeft: 10,
    },
    vehicleTextBold: {
        fontSize: 16,
        fontWeight: "600",
        color: "#404040",
    },
    vehicleText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#404040",
    },
});
