import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Header} from '@src/components/Header';
import {SafeAreaView} from '@src/components/SafeAreaWrapper';
import {AppStackParamList} from '@src/nav/navigators/Root.Main.App';
import {StripeProvider} from '@stripe/stripe-react-native';
import {useStripePublishableKey} from './index.data';
import {Content} from './index.content';

export function Settings__SavedCards_Add() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {stripePublishableKey} = useStripePublishableKey();

    return (
        <StripeProvider publishableKey={stripePublishableKey}>
            <SafeAreaView>
                <Header title="Add Card" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
                <Content />
            </SafeAreaView>
        </StripeProvider>
    );
}
