import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AppStackParamList} from '@src/nav/navigators/Root.Main.App';
import {trpc, TrpcInput} from '@src/trpc';

export type TAddVehiclePayload = TrpcInput['user']['vehicle']['add'];
export function useSubmit() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const mutation = trpc.user.vehicle.add.useMutation();

    const ctx = trpc.useUtils();
    const submit = (payload: TAddVehiclePayload) => {
        mutation.mutate(payload, {
            async onSuccess() {
                await ctx.user.vehicle.get.many.invalidate();
                navigation.navigate('Settings__Vehicle_List');
            },
        });
    };

    return Object.assign({submit}, mutation);
}
