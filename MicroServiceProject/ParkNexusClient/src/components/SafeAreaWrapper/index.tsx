import React from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {View, ViewProps} from "react-native";

export function SafeAreaView({style, ...rest}: ViewProps) {
    const {top, bottom} = useSafeAreaInsets();
    return (
        <View
            {...rest}
            style={[
                style,
                {
                    flex: 1,
                    paddingTop: top,
                    paddingBottom: bottom,
                    backgroundColor: "#FFF",
                },
            ]}
        />
    );
}
