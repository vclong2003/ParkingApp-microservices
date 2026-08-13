import React from "react";

import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";

import Toast from "react-native-toast-message";
import {toastConfig} from "@src/utils/toast";

import {RootNavigator} from "@src/nav";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import {KeyboardProvider} from "react-native-keyboard-controller";

import "@azure/core-asynciterator-polyfill";
import {RNEventSource} from "rn-eventsource-reborn";
import {ReadableStream, TransformStream} from "web-streams-polyfill";

// Polyfill for ReadableStream, TransformStream and EventSource for SSE
(globalThis as any).ReadableStream = (globalThis as any).ReadableStream || ReadableStream;
(globalThis as any).TransformStream = (globalThis as any).TransformStream || TransformStream;
(globalThis as any).EventSource = (globalThis as any).EventSource || RNEventSource;

export function Root() {
    return (
        <>
            <KeyboardProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                    <ActionSheetProvider>
                        <BottomSheetModalProvider>
                            <SafeAreaProvider>
                                <RootNavigator />
                            </SafeAreaProvider>
                        </BottomSheetModalProvider>
                    </ActionSheetProvider>
                </GestureHandlerRootView>
            </KeyboardProvider>
            <Toast config={toastConfig} />
        </>
    );
}
