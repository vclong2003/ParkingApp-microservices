import React from "react";
import {ParamListBase} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackNavigationOptions} from "@react-navigation/native-stack";

export function createStackNavigator<T extends ParamListBase>() {
    const {Navigator: BaseNavigator, Screen} = createNativeStackNavigator<T>();

    const screenOptions: NativeStackNavigationOptions = {
        headerShown: false,
        statusBarTranslucent: true,
        statusBarColor: "transparent",
        statusBarStyle: "dark",
        navigationBarColor: "transparent",
        gestureEnabled: false,
    };

    const Navigator = (props: {children: React.ReactNode; initialRouteName?: Extract<keyof T, string>}) => {
        return <BaseNavigator screenOptions={screenOptions} {...props} />;
    };

    return {Navigator, Screen};
}
