import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store.ts';
import {Appbar, PaperProvider} from 'react-native-paper';
import {TodoScreen} from './features/TodoScreen.tsx';
import {MockNetworkState} from './components/MockNetworkState.tsx';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Appbar.Header>
          <Appbar.Content title="Todos" />
        </Appbar.Header>
        <MockNetworkState />
        <TodoScreen />
      </PaperProvider>
    </Provider>
  );
}

export default App;
