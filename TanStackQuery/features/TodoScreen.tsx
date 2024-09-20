import 'react-native-get-random-values';

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {TodoListItem} from "@/components/TodoListItem";
import {useTodos} from "@/features/useTodos";


export function TodoScreen() {
  const {todos,addTodo, refresh, toggle} = useTodos();

  return (
    <ScrollView style={styles.container}>
      <Button mode="contained-tonal" onPress={addTodo}>
        Add
      </Button>
      <Button onPress={refresh}>Refresh</Button>
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onPress={() => toggle(todo.id)}
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
