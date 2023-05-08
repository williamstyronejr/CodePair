import { configureStore } from "@reduxjs/toolkit";
import reducers from "../reducers/index";
import { socketMiddlware } from "../utils/socket";

const initStore = configureStore({
  reducer: reducers as any,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({}).concat(socketMiddlware);

    return middleware;
  },
});

export default initStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof initStore.getState>;
