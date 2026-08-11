import React from "react";
import {createStackNavigator} from "@src/libs/StackNavigator";
import {TabNavigator} from "../Root.Main.App.Tabs";
import {ParkingLot__Detail} from "@src/nav/screens/Root.Main.App/ParkingLot__Detail";
import {ParkingLot__Add} from "@src/nav/screens/Root.Main.App/ParkingLot__Add";
import {useMe} from "./index.data";
import {ActivityIndicator} from "react-native";
import {Profile__Setup} from "@src/nav/screens/Root.Main.App/Profile__Setup";
import {ParkingLot__MyLotDetail} from "@src/nav/screens/Root.Main.App/ParkingLot__MyLotDetail";
import {ParkingLot__Update} from "@src/nav/screens/Root.Main.App/ParkingLot__Update";
import {ParkingLot__Prices__Manage} from "@src/nav/screens/Root.Main.App/ParkingLot__Prices__Manage";
import {ParkingLot__Services__Manage} from "@src/nav/screens/Root.Main.App/ParkingLot__Services__Manage";
import {ParkingLot__Spots__Manage} from "@src/nav/screens/Root.Main.App/ParkingLot__Spots__Manage";
import {Settings__Vehicle_List} from "@src/nav/screens/Root.Main.App/Settings__Vehicle_List";
import {Settings__Vehicle_Add} from "@src/nav/screens/Root.Main.App/Settings__Vehicle_Add";
import {TrpcOutput} from "@src/trpc";
import {Settings__Vehicle_Update} from "@src/nav/screens/Root.Main.App/Settings__Vehicle_Update";
import {Reservation__Make_Booking} from "@src/nav/screens/Root.Main.App/Reservation__Make_Booking";
import {Reservation__Ticket_Detail} from "@src/nav/screens/Root.Main.App/Reservation__Ticket_Detail";
import {Reservation__Ticket_Payment} from "@src/nav/screens/Root.Main.App/Reservation__Ticket_Payment";
import {Settings__SavedCards_List} from "@src/nav/screens/Root.Main.App/Settings__SavedCards_List";
import {Settings__SavedCards_Add} from "@src/nav/screens/Root.Main.App/Settings__SavedCards_Add";
import {Settings__Profile_Update} from "@src/nav/screens/Root.Main.App/Settings__Profile_Update";
import {Reservation__CICO} from "@src/nav/screens/Root.Main.App/Reservation__CICO";
import {Settings__Payout} from "@src/nav/screens/Root.Main.App/Settings__Payout";
import {Settings__Notification} from "@src/nav/screens/Root.Main.App/Settings__Notification";

export type AppStackParamList = {
    Profile__Setup: undefined;

    Tab: undefined;

    ParkingLot__Detail: {lotId: number};
    Reservation__Make_Booking: {lotId: number};
    Reservation__Ticket_Detail: {ticketId: number};
    Reservation__Ticket_Payment: {ticketId: number};
    Reservation__CICO: {ticketCode: string};

    ParkingLot__Add: undefined;
    ParkingLot__Update: {lotId: number};
    ParkingLot__MyLotDetail: {lotId: number};
    ParkingLot__Prices__Manage: {lotId: number};
    ParkingLot__Services__Manage: {lotId: number};
    ParkingLot__Spots__Manage: {lotId: number};

    Settings__Profile_Update: undefined;
    Settings__Vehicle_List: undefined;
    Settings__Vehicle_Add: undefined;
    Settings__Vehicle_Update: {vehicle: TrpcOutput["user"]["vehicle"]["get"]["many"][number]};
    Settings__SavedCards_List: undefined;
    Settings__SavedCards_Add: undefined;
    Settings__Payout: undefined;
    Settings__Notification: undefined;
};

const {Navigator, Screen} = createStackNavigator<AppStackParamList>();

export function AppNavigator() {
    const {me, isFetching} = useMe();

    const isUserProfileExists = !!me;

    if (isFetching) return <ActivityIndicator />;
    return (
        <Navigator initialRouteName="Tab">
            {!isUserProfileExists && <Screen name="Profile__Setup" component={Profile__Setup} />}
            {isUserProfileExists && (
                <>
                    <Screen name="Tab" component={TabNavigator} />

                    <Screen name="ParkingLot__Detail" component={ParkingLot__Detail} />
                    <Screen name="Reservation__Make_Booking" component={Reservation__Make_Booking} />
                    <Screen name="Reservation__Ticket_Detail" component={Reservation__Ticket_Detail} />
                    <Screen name="Reservation__Ticket_Payment" component={Reservation__Ticket_Payment} />
                    <Screen name="Reservation__CICO" component={Reservation__CICO} />

                    <Screen name="ParkingLot__MyLotDetail" component={ParkingLot__MyLotDetail} />
                    <Screen name="ParkingLot__Add" component={ParkingLot__Add} />
                    <Screen name="ParkingLot__Update" component={ParkingLot__Update} />
                    <Screen name="ParkingLot__Prices__Manage" component={ParkingLot__Prices__Manage} />
                    <Screen name="ParkingLot__Services__Manage" component={ParkingLot__Services__Manage} />
                    <Screen name="ParkingLot__Spots__Manage" component={ParkingLot__Spots__Manage} />

                    <Screen name="Settings__Profile_Update" component={Settings__Profile_Update} />
                    <Screen name="Settings__Vehicle_List" component={Settings__Vehicle_List} />
                    <Screen name="Settings__Vehicle_Add" component={Settings__Vehicle_Add} />
                    <Screen name="Settings__Vehicle_Update" component={Settings__Vehicle_Update} />
                    <Screen name="Settings__SavedCards_List" component={Settings__SavedCards_List} />
                    <Screen name="Settings__SavedCards_Add" component={Settings__SavedCards_Add} />
                    <Screen name="Settings__Payout" component={Settings__Payout} />
                    <Screen name="Settings__Notification" component={Settings__Notification} />
                </>
            )}
        </Navigator>
    );
}
