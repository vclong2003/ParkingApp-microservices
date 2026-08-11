import {Dimensions, StyleSheet} from "react-native";
const {width} = Dimensions.get("window");

export const styles = StyleSheet.create({
    imageWrapper: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: "hidden",
    },

    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 32,
    },

    infoWrapper: {
        gap: 16,
        marginBottom: 32,
    },
    textWrapper: {
        gap: 4,
    },
    nameText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
    },
    addressText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#5A5555",
    },
    pillsWrapper: {
        flexDirection: "row",
    },
    pill: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderColor: "#128085",
        borderRadius: 99,
        borderWidth: 1,
        marginRight: 8,
    },
    pillText: {
        fontSize: 16,
        fontWeight: "400",
        color: "#662400",
    },
    infoButtonsWrapper: {
        flexDirection: "row",
        gap: 8,
    },
    infoButtonText: {
        color: "#128085",
    },

    servicesWrapper: {
        gap: 16,
        marginBottom: 32,
    },
    serviceTitleText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },
    serviceItemsWrapper: {
        flexDirection: "row",
        gap: 4,
    },
    serviceItem: {
        flexDirection: "column",
        width: "25%",
        height: (width / 4) * 0.6,
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
    },
    serviceItemText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#5A5555",
    },

    descriptionWrapper: {
        gap: 16,
        marginBottom: 64,
    },
    descriptionTitleText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#5A5555",
    },

    bookButton: {
        position: "absolute",
        left: 20,
        right: 20,
    },
    bookButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
