import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store.ts';
import {addTodo, fetchTodos, selectTodos, toggle} from './todosSlice.ts';
import {TodoListItem} from '../components/TodoListItem.tsx';
import {Button} from 'react-native-paper';

export function TodoScreen() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const handlePress = (todoId: string) => {
    dispatch(toggle(todoId));
  };

  const handleAdd = () => {
    const title = new Date().toDateString();
    dispatch(addTodo(title));
  };

  const handleRefresh = () => {
    dispatch(fetchTodos());
  };

  return (
    <ScrollView style={styles.container}>
      <Button mode="contained-tonal" onPress={handleAdd}>
        Add
      </Button>
      <Button onPress={handleRefresh}>Refresh</Button>
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onPress={() => handlePress(todo.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
