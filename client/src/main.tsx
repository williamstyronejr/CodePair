import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Root from './pages/Root';
import store from './store';
import { setupSocketHandlers } from './middlewares/socket';
import { fetchUserData } from './reducers/userReducer';
import './styles/index.css';
import 'normalize.css';

// TODO: Dispatch only when there's a cookie present
store.dispatch(fetchUserData());

setupSocketHandlers(store);

const container = document.getElementById('root');
const root = createRoot(container as any);
root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
