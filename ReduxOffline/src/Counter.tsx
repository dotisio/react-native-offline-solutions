import React from 'react';
import {decrement, increment} from './counterSlice';
import {useAppDispatch, useAppSelector} from './store.ts';
import {Button, Text, View} from 'react-native';

export function Counter() {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <View>
      <View>
        <Button onPress={() => dispatch(increment())} title="Increment" />
        <Text>{count}</Text>
        <Button onPress={() => dispatch(decrement())} title="Decrement" />
      </View>
    </View>
  );
}
