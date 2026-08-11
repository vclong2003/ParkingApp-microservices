import React from "react";
import {RouteProp} from "@react-navigation/native";
import {SpotManagerContext} from "./index.context";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {List} from "./List";

type ScreenProps = {
    route: RouteProp<AppStackParamList, "ParkingLot__Spots__Manage">;
};
export function ParkingLot__Spots__Manage({route}: ScreenProps) {
    return (
        <SpotManagerContext lotId={route.params.lotId}>
            <List />
        </SpotManagerContext>
    );
}
