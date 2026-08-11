import {ActivityIndicator, Text, View} from 'react-native';
import {styles} from './index.styles';

export function LoadingScreen() {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color="#FFF" size="large" />
    </View>
  );
}
