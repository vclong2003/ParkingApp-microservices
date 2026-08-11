import React from "react";

import {NavigationContainer} from "@react-navigation/native";
import {GlobalGuard} from "@src/components/GlobalGuard";

import {RootScreens} from "./index.screens";

export function RootNavigator() {
    return (
        <NavigationContainer>
            <GlobalGuard>
                <RootScreens />
            </GlobalGuard>
        </NavigationContainer>
    );
}
