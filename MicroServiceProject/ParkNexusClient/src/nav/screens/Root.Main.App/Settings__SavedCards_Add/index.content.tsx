import {StyleSheet, Text, View} from 'react-native';
import {useSubmit} from './index.submit';
import {createPaymentMethod, CardField} from '@stripe/stripe-react-native';
import {Button} from '@src/components/Button';
import {useState} from 'react';

export function Content() {
    const {addCard, isPending} = useSubmit();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddCard = async () => {
        if (isPending || isLoading) return;
        setIsLoading(true);
        const {paymentMethod, error} = await createPaymentMethod({
            paymentMethodType: 'Card',
        });
        if (paymentMethod) addCard({stripeMethodId: paymentMethod.id});
        if (error) console.log(error);
        setIsLoading(false);
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Enter your card details</Text>
            <CardField
                postalCodeEnabled={false}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#f1f1f1',
                    textColor: '#000000',
                }}
                style={styles.cardField}
            />
            <Button
                variant="green"
                disabled={isPending || isLoading}
                text={isPending || isLoading ? 'Saving card...' : 'Add card'}
                onPress={handleAddCard}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555555',
    },
    cardField: {
        width: '100%',
        height: 60,
        marginVertical: 8,
    },
});
