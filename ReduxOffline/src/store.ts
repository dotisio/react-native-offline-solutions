import {configureStore, StoreEnhancer} from '@reduxjs/toolkit';
import {todosSlice} from './features/todosSlice.ts';
import {useDispatch, useSelector} from 'react-redux';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import {offline} from '@redux-offline/redux-offline';

export let setNetworkState = (_: boolean) => {};

offlineConfig.detectNetwork = cb => {
  setNetworkState = cb;
  cb(true);
};

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(offline(offlineConfig) as StoreEnhancer),
});

// used for debugging the demo app
// @ts-ignore
global.store = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
