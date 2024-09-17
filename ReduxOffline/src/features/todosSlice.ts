import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Todo} from '../models/Todo.ts';
import {v4 as uuidv4} from 'uuid';
import {RootState} from '../store.ts';
import {TodoApi} from '../api/TodoApi.ts';

interface TodosSlice {
  todos: Todo[];
}

const initialState: TodosSlice = {
  todos: [
    {
      id: '1',
      title: 'First todo',
      isDone: false,
    },
  ],
};

type NewTodo = Omit<Todo, 'id'>;

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  return await TodoApi.getTodos();
});

export const todosSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addTodoOld: (state, action: PayloadAction<NewTodo>) => {
      const newTodo = {
        id: uuidv4(),
        ...action.payload,
      };

      state.todos.push(newTodo);
    },
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (text: string) => {
        const payload = {
          id: uuidv4(),
          title: text,
          isDone: false,
        };

        return {
          payload,
          meta: {
            offline: {
              effect: {
                url: 'http://10.0.2.2:3000/todos',
                method: 'POST',
                json: {...payload},
              },
              // commit: { type: 'FOLLOW_USER_COMMIT', meta: { userId } },
              // rollback: { type: 'FOLLOW_USER_ROLLBACK', meta: { userId } }
            },
          },
        };
      },
    },
    toggleOld: (state, action: PayloadAction<string>) => {
      const target = state.todos.find(item => item.id === action.payload);

      if (target !== undefined) {
        target.isDone = !target.isDone;
      }
    },
    toggle: {
      reducer: (state, action: PayloadAction<string>) => {
        const target = state.todos.find(item => item.id === action.payload);

        if (target !== undefined) {
          target.isDone = !target.isDone;
        }
      },
      prepare: (text: string) => {
        return {
          payload: text,
          meta: {
            offline: {
              // effect: {url: '/api/follow', method: 'POST', json: {userId}},
              // commit: { type: 'FOLLOW_USER_COMMIT', meta: { userId } },
              // rollback: { type: 'FOLLOW_USER_ROLLBACK', meta: { userId } }
            },
          },
        };
      },
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload;
    });
  },
});

export const selectTodos = (state: RootState) => state.todos.todos;

export const {addTodo, toggle} = todosSlice.actions;
