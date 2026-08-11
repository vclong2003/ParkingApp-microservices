import React from "react";

import {MainSwitch} from "../Root.Main";
import {createStackNavigator} from "@src/libs/StackNavigator";

const {Navigator, Screen} = createStackNavigator();

export function RootScreens() {
    return (
        <Navigator>
            <Screen name="Main" component={MainSwitch} />
        </Navigator>
    );
}
