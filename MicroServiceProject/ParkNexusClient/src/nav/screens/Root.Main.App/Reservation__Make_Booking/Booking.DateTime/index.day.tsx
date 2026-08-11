import {DateData} from 'react-native-calendars';
import {DayProps} from 'react-native-calendars/src/calendar/day';
import {useMakeBookingContext} from '../index.context';
import dayjs from 'dayjs';
import {Text, TouchableOpacity} from 'react-native';

type TDayProps = DayProps & {date?: DateData};
export function Day({date, state}: TDayProps) {
    const {startTime, setStartTime, endTime, setEndTime, minimumStartTime, maximumStartTime, minimumEndTime} =
        useMakeBookingContext();

    const isStartDate = dayjs(date?.dateString).isSame(startTime, 'day');
    const isEndDate = dayjs(date?.dateString).isSame(endTime, 'day');
    const isBetween =
        !isStartDate &&
        !isEndDate &&
        dayjs(date?.dateString).isAfter(startTime, 'day') &&
        dayjs(date?.dateString).isBefore(endTime, 'day');

    const isDisabled = state === 'disabled';
    const isSelected = isStartDate || isEndDate || isBetween;

    const borderLeftRadius = isStartDate ? 40 : 0;
    const borderRightRadius = isEndDate ? 40 : 0;
    const backgroundColor = isSelected ? 'teal' : 'white';
    const textColor = isDisabled ? '#b9b9b9' : isSelected ? 'white' : 'black';

    return (
        <TouchableOpacity
            // onPress={() => (isDisabled ? {} : setStartTime(dayjs(date?.dateString).toDate()))}
            style={{
                backgroundColor,
                width: '100%',
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: borderLeftRadius,
                borderBottomLeftRadius: borderLeftRadius,
                borderTopRightRadius: borderRightRadius,
                borderBottomRightRadius: borderRightRadius,
            }}>
            <Text style={{color: textColor}}>{date?.day}</Text>
        </TouchableOpacity>
    );
}
