import {createBottomTabNavigator} from '@src/libs/bottomTabNavigator';

import {Home} from '@src/nav/screens/Root.Main.App.Tabs/Home';
import {Settings} from '@src/nav/screens/Root.Main.App.Tabs/Settings';
import {LotManagement} from '@src/nav/screens/Root.Main.App.Tabs/LotManagement';
import {Ticket} from '@src/nav/screens/Root.Main.App.Tabs/Ticket';

import HomeSvg from '@src/static/svgs/Home.svg';
import HomeTealSvg from '@src/static/svgs/HomeTeal.svg';

import Receipt from '@src/static/svgs/Receipt.svg';
import ReceiptTeal from '@src/static/svgs/ReceiptTeal.svg';

import ParkingFeeSvg from '@src/static/svgs/ParkingFee.svg';
import ParkingFeeTealSvg from '@src/static/svgs/ParkingFeeTeal.svg';

import SettingsSvg from '@src/static/svgs/Settings.svg';
import SettingsSvgTeal from '@src/static/svgs/SettingsTeal.svg';

export type TabParamList = {
    Home: undefined;
    Ticket: undefined;
    'Your Lots': undefined;
    Settings: undefined;
};

const {Navigator, Screen} = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
    const iconProps = {width: 20, height: 20};

    return (
        <Navigator>
            <Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (focused ? <HomeTealSvg {...iconProps} /> : <HomeSvg {...iconProps} />),
                }}
            />
            <Screen
                name="Ticket"
                component={Ticket}
                options={{
                    tabBarIcon: ({focused}) => (focused ? <ReceiptTeal {...iconProps} /> : <Receipt {...iconProps} />),
                }}
            />
            <Screen
                name="Your Lots"
                component={LotManagement}
                options={{
                    tabBarIcon: ({focused}) =>
                        focused ? <ParkingFeeTealSvg {...iconProps} /> : <ParkingFeeSvg {...iconProps} />,
                }}
            />
            <Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({focused}) =>
                        focused ? <SettingsSvgTeal {...iconProps} /> : <SettingsSvg {...iconProps} />,
                }}
            />
        </Navigator>
    );
}
