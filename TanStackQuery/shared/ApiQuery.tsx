import {PropsWithChildren, useEffect} from "react";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {AppState, AppStateStatus, Platform} from "react-native";
import {DefaultError, focusManager, QueryClient} from "@tanstack/react-query";
import {Todo} from "@/models/Todo";
import {TodoApi} from "@/api/TodoApi";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";


function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active')
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
        },
    },
})

queryClient.setMutationDefaults<unknown, DefaultError, Todo>(['addTodo'], {
    mutationFn: (newTodo) => {
        console.log(newTodo)
        return TodoApi.postTodo(newTodo)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
})

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
})

const persisterOptions = {persister: asyncStoragePersister, maxAge: Infinity}

/*
type SetNetworkState = (isConnected: boolean) => void
interface IMockNetworkStateContext {
    setNetworkState: SetNetworkState
}
const MockNetworkStateContext = createContext<IMockNetworkStateContext>({setNetworkState: () => {}})
export const useMockNetworkState = () => {
    const context = useContext(MockNetworkStateContext);

    return context
}
*/


export function ApiQueryProvider({children}: PropsWithChildren) {

    useEffect(() => {
        // todo: check if this runs when the app goes into the background
        const subscription = AppState.addEventListener('change', onAppStateChange)

        return () => subscription.remove()
    }, [])

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persisterOptions}
            onSuccess={() => {
                queryClient.resumePausedMutations();
            }}
        >
            {children}
        </PersistQueryClientProvider>

    )
}