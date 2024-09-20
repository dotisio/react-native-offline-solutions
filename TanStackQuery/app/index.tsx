import {AppState, AppStateStatus, Platform} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {focusManager, onlineManager, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import {TodoScreen} from "@/features/TodoScreen";
import {PaperProvider} from "react-native-paper";
import {useEffect} from "react";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";

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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
        },
    },
})
const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
})

const persisterOptions = {persister: asyncStoragePersister, maxAge: Infinity}

export default function Root() {
    useEffect(() => {
        // todo: check if this runs when the app goes into the background
        const subscription = AppState.addEventListener('change', onAppStateChange)

        return () => subscription.remove()
    }, [])


    return (
        <PersistQueryClientProvider client={queryClient} persistOptions={persisterOptions}>
            <PaperProvider>
                <TodoScreen/>
            </PaperProvider>
        </PersistQueryClientProvider>

    );
}