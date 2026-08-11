import React from "react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Text, View} from "react-native";
import Modal from "react-native-modal";

import TickTealSvg from "@src/static/svgs/TickTeal.svg";
import {Button} from "@src/components/Button";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

export type TBookingSuccessModalRef = {
    show: (ticketId: number) => void;
};
export const BookingSuccessModal = forwardRef<TBookingSuccessModalRef>((_, ref) => {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const [visible, setVisible] = useState(false);
    const [ticketId, setTicketId] = useState<number>();

    useImperativeHandle(ref, () => ({
        show: (ticketId: number) => {
            setVisible(true);
            setTicketId(ticketId);
        },
    }));

    return (
        <Modal isVisible={visible} style={{justifyContent: "center", alignItems: "center"}}>
            <View
                style={{
                    width: 250,
                    borderRadius: 16,
                    backgroundColor: "#128085",
                    alignItems: "center",
                    paddingHorizontal: 32,
                    paddingVertical: 32,
                }}>
                <View
                    style={{
                        backgroundColor: "#FFF",
                        borderRadius: 32,
                        width: 90,
                        height: 90,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <TickTealSvg width={50} height={50} />
                </View>
                <View style={{height: 24}} />
                <Text style={{color: "#FAFAFA", fontSize: 18, fontWeight: "700", textAlign: "center"}}>Successful</Text>
                <View style={{height: 6}} />
                <Text style={{color: "#A4F4E7", fontSize: 14, fontWeight: "400", textAlign: "center"}}>
                    Your booking has been made successfully!
                </Text>
                <View style={{height: 24}} />
                <Button
                    variant="white"
                    text="Pay now"
                    style={{width: "100%"}}
                    onPress={() => {
                        navigation.navigate("Reservation__Ticket_Payment", {ticketId: ticketId!});
                        setVisible(false);
                    }}
                />
                <View style={{height: 8}} />
                <Button
                    variant="white"
                    text="View ticket"
                    textProps={{style: {color: "#FFE7DB"}}}
                    style={{width: "100%", backgroundColor: "transparent", borderColor: "#FFE7DB", borderWidth: 1}}
                    onPress={() => {
                        navigation.navigate("Reservation__Ticket_Detail", {ticketId: ticketId!});
                        setVisible(false);
                    }}
                />
            </View>
        </Modal>
    );
});
