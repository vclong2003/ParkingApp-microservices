import React, {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {View} from "react-native";
import {Calendar, CalendarProps} from "react-native-calendars";
import {useMakeBookingContext} from "../index.context";
import {Day} from "./index.day";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useState} from "react";
import {Button} from "@src/components/Button";
import dayjs from "dayjs";
import {styles} from "./index.styles";
import {MINIMUM_DURATION_IN_HOURS} from "@parknexus/api/rules";

export function DateTime() {
    const navigation = useNavigation();
    const {startTime, setStartTime, endTime, setEndTime, minimumStartTime, maximumStartTime, minimumEndTime, setStep} =
        useMakeBookingContext();

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const calendarProps: CalendarProps = {
        dayComponent: Day,
        hideArrows: true,
        enableSwipeMonths: true,
    };

    useEffect(() => {
        if (startTime.isAfter(endTime)) {
            setEndTime(startTime.add(MINIMUM_DURATION_IN_HOURS, "hour"));
        }
    }, [startTime, endTime, setEndTime]);

    return (
        <SafeAreaView>
            <Header title="Select start time" backButtonVisible onBackButtonPress={() => navigation.goBack()} />

            <View style={styles.wrapper}>
                <Calendar {...calendarProps} />
                <Button
                    variant="gray"
                    onPress={() => setStartDatePickerVisibility(true)}
                    text={`Check in ${dayjs(startTime).format("HH:mm")}`}
                />
                <View style={{height: 8}} />
                <Button
                    variant="gray"
                    onPress={() => setEndDatePickerVisibility(true)}
                    text={`Check out ${dayjs(endTime).format("HH:mm")}`}
                />
            </View>
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                date={startTime.toDate()}
                mode="datetime"
                is24Hour
                minimumDate={minimumStartTime.toDate()}
                maximumDate={maximumStartTime.toDate()}
                onConfirm={date => {
                    setStartTime(dayjs(date));
                    setStartDatePickerVisibility(false);
                }}
                onCancel={() => setStartDatePickerVisibility(false)}
            />
            <Button variant="green" text="Next" onPress={() => setStep("VEHICLE")} style={styles.nextBtn} />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                date={endTime.toDate()}
                mode="datetime"
                is24Hour
                minimumDate={minimumEndTime.toDate()}
                onConfirm={date => {
                    setEndTime(dayjs(date));
                    setEndDatePickerVisibility(false);
                }}
                onCancel={() => setEndDatePickerVisibility(false)}
            />
        </SafeAreaView>
    );
}
