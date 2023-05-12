import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers/index';
import { socketMiddlware } from '../middlewares/socket';

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({}).prepend(socketMiddlware);

    return middleware;
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
