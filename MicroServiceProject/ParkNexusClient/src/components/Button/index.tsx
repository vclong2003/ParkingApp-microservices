import React from "react";
import {TouchableOpacity, TouchableOpacityProps, TextProps, Text} from "react-native";
import {styles} from "./index.parts";

type TButtonVariant = "green" | "white" | "gray" | "pink";

interface IButtonProps extends TouchableOpacityProps {
    variant: TButtonVariant;

    preIcon?: React.ReactNode;
    postIcon?: React.ReactNode;

    text?: string;
    textProps?: TextProps;
}

export function Button(props: IButtonProps) {
    const {variant, preIcon, postIcon, text, textProps, disabled, ...rest} = props;

    const {style: buttonStyle, ...buttonRest} = rest;
    const {style: textStyle, ...textPropsRest} = textProps || {};

    const buttonColor = (variant: TButtonVariant) => {
        if (variant === "green") return "#128085";
        if (variant === "white") return "#FFF";
        if (variant === "gray") return "#E5E5E5";
        if (variant === "pink") return "#FFD0B6";
    };

    const textColor = (variant: TButtonVariant) => {
        if (variant === "green") return "#FFF";
        if (variant === "white") return "#128085";
        if (variant === "gray") return "#128085";
        if (variant === "pink") return "#B33E00";
    };

    return (
        <TouchableOpacity
            style={[{backgroundColor: buttonColor(variant), opacity: disabled ? 0.6 : 1}, styles.button, buttonStyle]}
            disabled={disabled}
            {...buttonRest}>
            {preIcon}
            {text && (
                <Text style={[{color: textColor(variant)}, styles.text, textStyle]} {...textPropsRest}>
                    {text}
                </Text>
            )}
            {postIcon}
        </TouchableOpacity>
    );
}
