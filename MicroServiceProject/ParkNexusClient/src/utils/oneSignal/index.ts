import {OneSignalTypes} from "@src/types/types.onesignal";
import {OneSignal} from "react-native-onesignal";

export function useSetupOneSignal() {
    OneSignal.initialize(OneSignalTypes.ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
}
