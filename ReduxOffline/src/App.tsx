/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import {Counter} from './Counter.tsx';
import {store} from './store.ts';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <Provider store={store}>
        <Counter />
      </Provider>
    </SafeAreaView>
  );
}

export default App;
