import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TodoApi} from "@/api/TodoApi";
import {v4 as uuidv4} from "uuid";

export const useTodos = () => {
    const queryClient = useQueryClient()

    // Queries
    const query = useQuery({ queryKey: ['todos'], queryFn: TodoApi.getTodos })

    const todos = query.data ?? [];

    // Mutations
    const mutation = useMutation({
        mutationFn: TodoApi.postTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })

    const putMutation = useMutation({
        mutationFn: TodoApi.putTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })


    return {
        todos,
        addTodo: () => {
            const newTodo = {
                id: uuidv4(),
                title: "hello" + Date.now(),
                isDone: false,
            }

            mutation.mutate(newTodo);
        },
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        toggle: (id: string) => {
            console.log(id)
            const preState = todos.find(todo => todo.id === id);

            if (!preState) {
                console.log("Can't toggle todo")
                return
            }

            putMutation.mutate({...preState, isDone: !preState.isDone})
        }
    }
}