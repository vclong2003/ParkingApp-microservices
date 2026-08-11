import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AppStackParamList} from '@src/nav/navigators/Root.Main.App';
import {trpc, TrpcInput} from '@src/trpc';

export type TUpdateParkingLotPayload = TrpcInput['parking']['lot']['update'];
export function useSubmit() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const mutation = trpc.parking.lot.update.useMutation();

    const ctx = trpc.useUtils();
    const submit = (payload: TUpdateParkingLotPayload) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.parking.lot.get.single.invalidate();
                navigation.navigate('ParkingLot__MyLotDetail', {lotId: payload.id});
            },
        });
    };

    return Object.assign(mutation, {submit});
}
