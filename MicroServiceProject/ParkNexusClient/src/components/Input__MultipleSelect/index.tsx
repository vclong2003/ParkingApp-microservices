import React from "react";
import {View, ScrollView, TouchableOpacity, Text} from "react-native";
import CrossSvg from "@src/static/svgs/Cross.svg";
import {styles} from "./index.styles";

type Option<T> = {
    label: string;
    value: T;
};
type TInputMultipleSelectProps<T> = {
    options: Option<T>[];
    selectedOptions: T[];
    onChange: (selectedOptions: T[]) => void;
};
export function InputMultipleSelect<T>({options, selectedOptions, onChange}: TInputMultipleSelectProps<T>) {
    return (
        <View style={styles.wrapper}>
            <ScrollView horizontal style={styles.selectedOptionsWrapper}>
                {selectedOptions.map((option, index) => (
                    <TouchableOpacity
                        style={styles.selectedOption}
                        key={index}
                        onPress={() => onChange(selectedOptions.filter(item => item !== option))}>
                        <Text style={styles.selectedOptionText}>
                            {options.find(item => item.value === option)?.label}
                        </Text>
                        <CrossSvg width={18} height={18} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView horizontal style={styles.optionsWrapper}>
                {options
                    .filter(option => !selectedOptions.includes(option.value))
                    .map((option, index) => (
                        <TouchableOpacity
                            style={styles.option}
                            key={index}
                            onPress={() => onChange([...selectedOptions, option.value])}>
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </View>
    );
}
