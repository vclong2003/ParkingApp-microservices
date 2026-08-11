import {MMKV as RnMmkv} from "react-native-mmkv";

export class MMKV {
    static instance: RnMmkv;

    static getInstance() {
        if (!MMKV.instance) {
            MMKV.instance = new RnMmkv();
        }
        return MMKV.instance;
    }
}
