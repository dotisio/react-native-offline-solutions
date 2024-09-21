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

queryClient.setMutationDefaults(['postTodo'], {
    mutationFn: TodoApi.postTodo,
    onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ['todos'] })

        const previousTodos = queryClient.getQueryData(['todos'])
        queryClient.setQueryData(['todos'], (old: Todo[]) => [...old, newTodo])

        return { previousTodos }
    },
    onError: (err, newTodo, context) => {
        queryClient.setQueryData(['todos'], context?.previousTodos as Todo[])
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
})


queryClient.setMutationDefaults(['putTodo'], {
    mutationFn: TodoApi.putTodo,
    onMutate: async (updatedTodo) => {
        await queryClient.cancelQueries({ queryKey: ['todos'] })

        const previousTodos = queryClient.getQueryData(['todos'])
        queryClient.setQueryData(['todos'], (old: Todo[]) => {
            return old.map(todo => {
                return todo.id === updatedTodo.id ? updatedTodo : todo;
            })
        })

        return { previousTodos }
    },
    onError: (err, newTodo, context) => {
        queryClient.setQueryData(['todos'], context?.previousTodos as Todo[])
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
})

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
})

const persisterOptions = {persister: asyncStoragePersister, maxAge: Infinity}


export function ApiQueryProvider({children}: PropsWithChildren) {
    useEffect(() => {
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