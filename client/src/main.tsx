import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Root from "./pages/Root";
import store from "./store/store";
import { getUserData } from "./actions/authentication";
import setupSocket from "./utils/socket";
import "normalize.css";
import "./styles/index.css";

// TODO: Dispatch only when there's a cookie present
store.dispatch(getUserData());

// Setup handlers for socket
setupSocket(store);

const container = document.getElementById("root");
const root = createRoot(container as any);
root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
