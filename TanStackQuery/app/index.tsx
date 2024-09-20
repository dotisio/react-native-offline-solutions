import {AppState, AppStateStatus, Platform} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {focusManager, onlineManager, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import {TodoScreen} from "@/features/TodoScreen";
import {PaperProvider} from "react-native-paper";
import {useEffect} from "react";

function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active')
    }
}

onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected)
    })
})

SplashScreen.hideAsync();

const queryClient = new QueryClient()


export default function Root() {
    useEffect(() => {
        // todo: check if this runs when the app goes into the background
        const subscription = AppState.addEventListener('change', onAppStateChange)

        return () => subscription.remove()
    }, [])


    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider>
                <TodoScreen/>
            </PaperProvider>
        </QueryClientProvider>

    );
}