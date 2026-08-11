import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AppStackParamList} from '@src/nav/navigators/Root.Main.App';
import {trpc, TrpcInput} from '@src/trpc';

type TAddCardPayload = TrpcInput['payment']['method']['add'];
export function useSubmit() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const mutation = trpc.payment.method.add.useMutation();

    const ctx = trpc.useUtils();
    const addCard = async (payload: TAddCardPayload) => {
        mutation.mutateAsync(payload, {
            async onSuccess() {
                await ctx.payment.method.get.many.invalidate();
                navigation.navigate('Settings__SavedCards_List');
            },
        });
    };

    return Object.assign({addCard}, mutation);
}
