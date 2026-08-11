import {ReactNode} from 'react';
import {useMakeBookingContext} from './index.context';
import {TBookingStep} from './index.types';
import {DateTime} from './Booking.DateTime';
import {Vehicle} from './Booking.Vehicle';
import {Services} from './Booking.Services';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {TabParamList} from '@src/nav/navigators/Root.Main.App.Tabs';
import {Summary} from './Booking.Summary';

export function Content() {
    const navigation = useNavigation<NavigationProp<TabParamList>>();
    const {top} = useSafeAreaInsets();
    const {step} = useMakeBookingContext();

    const content: Record<TBookingStep, ReactNode> = {
        DATE_TIME: <DateTime />,
        VEHICLE: <Vehicle />,
        SERVICES: <Services />,
        SUMMARY: <Summary />,
    };

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    top: top,
                    right: 16,
                    zIndex: 1,
                    backgroundColor: '#127f85f',
                    borderRadius: 55,
                }}>
                <CountdownCircleTimer
                    size={55}
                    strokeWidth={4}
                    trailColor="#127f851c"
                    isPlaying
                    duration={600}
                    colors={['#128085', '#128085', '#128085', '#128085']}
                    onComplete={() => navigation.navigate('Home')}
                    colorsTime={[600, 400, 200, 0]}>
                    {({remainingTime}) => (
                        <Text style={{fontSize: 12, fontWeight: '600'}}>
                            {Math.floor(remainingTime / 60)}:
                            {remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}
                        </Text>
                    )}
                </CountdownCircleTimer>
            </View>
            {content[step]}
        </>
    );
}
