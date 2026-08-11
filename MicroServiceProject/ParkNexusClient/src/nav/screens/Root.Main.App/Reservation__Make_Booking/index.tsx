import React from "react";
import {RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {MakeBookingContext} from "./index.context";
import {Content} from "./index.content";

type ScreenProps = {
    route: RouteProp<AppStackParamList, "Reservation__Make_Booking">;
};

export function Reservation__Make_Booking({route}: ScreenProps) {
    return (
        <MakeBookingContext lotId={route.params.lotId}>
            <Content />
        </MakeBookingContext>
    );
}
