import React from "react";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {PriceManagerContext} from "./index.context";
import {List} from "./List";

type ScreenParams = {
    navigation: NavigationProp<AppStackParamList>;
    route: RouteProp<AppStackParamList, "ParkingLot__Prices__Manage">;
};
export function ParkingLot__Prices__Manage({route}: ScreenParams) {
    const {lotId} = route.params;
    return (
        <PriceManagerContext lotId={lotId}>
            <List />
        </PriceManagerContext>
    );
}
