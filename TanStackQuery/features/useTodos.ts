import {DefaultError, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TodoApi} from "@/api/TodoApi";
import {v4 as uuidv4} from "uuid";
import {Todo} from "@/models/Todo";

export const useTodos = () => {
    const queryClient = useQueryClient()

    const query = useQuery({ queryKey: ['todos'], queryFn: TodoApi.getTodos })

    const todos = query.data ?? [];

    const postMutation = useMutation<unknown, DefaultError, Todo>({ mutationKey: ['postTodo'] })
    const putMutation = useMutation<unknown, DefaultError, Todo>({ mutationKey: ['putTodo'] })


    return {
        todos,
        addTodo: () => {
            const newTodo = {
                id: uuidv4(),
                title: "hello" + Date.now(),
                isDone: false,
            }

            postMutation.mutate(newTodo);
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