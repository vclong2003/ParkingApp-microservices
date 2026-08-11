import {useAuthStore} from '@src/states';
import {AppNavigator} from '../Root.Main.App';
import {AuthNavigator} from '../Root.Main.Auth';

export function MainSwitch() {
    const {isAuthenticated} = useAuthStore();

    if (isAuthenticated) {
        return <AppNavigator />;
    }

    return <AuthNavigator />;
}
