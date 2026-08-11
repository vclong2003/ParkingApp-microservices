import React from "react";
import {TextInput as BaseTextInput, TextInputProps as BaseTextInputProps, Text, View, ViewProps} from "react-native";
import {styles} from "./index.styles";

interface ITextInputProps extends BaseTextInputProps {
    wrapperProps?: ViewProps;
    preIcon?: React.ReactNode;
    postIcon?: React.ReactNode;
    error?: string;
}

export function TextInput(props: ITextInputProps) {
    const {style, wrapperProps, preIcon, postIcon, error, ...rest} = props;

    const {style: wrapperStyle, ...restWrapperProps} = wrapperProps || {};

    return (
        <>
            <View {...restWrapperProps} style={[styles.wrapper, wrapperStyle]}>
                {preIcon}
                <BaseTextInput {...rest} style={[styles.textInput, style]} />
                {postIcon}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
    );
}
