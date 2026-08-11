import {Pressable, View} from 'react-native';
import {styles} from './index.styles';

type TRadioButtonProps = {
    onPress?: () => void;
    isSelected: boolean;
};
export function InputRadioButton({isSelected, onPress}: TRadioButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <View style={[styles.dot, {backgroundColor: isSelected ? '#128085' : 'transparent'}]} />
        </Pressable>
    );
}
