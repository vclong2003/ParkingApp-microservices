import React from "react";
import {View, ViewStyle, Text} from "react-native";
import {styles} from "./index.styles";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import ChevronLeft from "@src/static/svgs/ChevronLeft.svg";

interface IHeaderProps {
    backButtonVisible?: boolean;
    onBackButtonPress?: () => void;

    title?: string;

    rightButtonIcon?: React.ReactNode;
    onRightButtonPress?: () => void;

    wrapperStyle?: ViewStyle;
}

export function Header({
    backButtonVisible,
    onBackButtonPress,
    rightButtonIcon,
    onRightButtonPress,
    title,
    wrapperStyle,
}: IHeaderProps) {
    return (
        <View style={[styles.wrapper, wrapperStyle]}>
            <TouchableWithoutFeedback style={styles.buttonWrapper} onPress={onBackButtonPress}>
                {backButtonVisible && <ChevronLeft width={24} height={24} />}
            </TouchableWithoutFeedback>

            <Text style={styles.title}>{title}</Text>

            <TouchableWithoutFeedback style={styles.buttonWrapper} onPress={onRightButtonPress}>
                {rightButtonIcon}
            </TouchableWithoutFeedback>
        </View>
    );
}
