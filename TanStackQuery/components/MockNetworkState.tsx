import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {setNetworkState} from '../store.ts';

export const MockNetworkState = () => {
  return (
    <View>
      <Button onPress={() => setNetworkState(true)}>Online</Button>
      <Button onPress={() => setNetworkState(false)}>Offline</Button>
    </View>
  );
};
