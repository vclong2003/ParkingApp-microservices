import {NavigationProp, RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '@src/nav/navigators/Root.Main.App';
import {ServiceManagerContext} from './index.context';
import {List} from './List';

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList, 'ParkingLot__Services__Manage'>;
    route: RouteProp<AppStackParamList, 'ParkingLot__Services__Manage'>;
};
export function ParkingLot__Services__Manage({route}: ScreenProps) {
    return (
        <ServiceManagerContext lotId={route.params.lotId}>
            <List />
        </ServiceManagerContext>
    );
}
