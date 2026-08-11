import React from "react";
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator as rnCreateBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {ParamListBase} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {BlurView} from "@react-native-community/blur";

export function createBottomTabNavigator<T extends ParamListBase>() {
    const {Navigator: BaseNavigator, Screen} = rnCreateBottomTabNavigator<T>();

    const screenOptions: BottomTabNavigationOptions = {
        headerShown: false,
        tabBarBackground: () => (
            <BlurView style={{flex: 1, backgroundColor: "rgba(11, 10, 10, 0.25)"}} blurType="light" blurAmount={10} />
        ),
        tabBarStyle: {
            minHeight: 65,
            marginHorizontal: 20,
            position: "absolute",
            bottom: 24,
            borderRadius: 12,

            overflow: "hidden",
            paddingBottom: 10,
        },

        tabBarButton(props) {
            return <TouchableOpacity {...props} style={{flex: 1, padding: 8}} />;
        },

        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
        },

        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#128085",
    };

    const Navigator = (props: {children: React.ReactNode; initialRouteName?: Extract<keyof T, string>}) => {
        return <BaseNavigator screenOptions={screenOptions} {...props} />;
    };

    return {Navigator, Screen};
}
