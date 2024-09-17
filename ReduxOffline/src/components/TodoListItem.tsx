import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Todo} from '../models/Todo.ts';

interface TodoProps {
  todo: Todo;
  onPress: () => void;
}

export function TodoListItem(props: TodoProps) {
  const status = props.todo.isDone ? 'checked' : 'unchecked';

  return (
    <View style={styles.container}>
      <Checkbox status={status} onPress={props.onPress} />
      <Text>{props.todo.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
