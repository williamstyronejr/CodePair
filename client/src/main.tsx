import { createRoot } from 'react-dom/client';
import Root from './pages/Root';
import Providers from './Providers';
import './styles/index.css';
import 'normalize.css';

// TODO: Dispatch only when there's a cookie present
// store.dispatch(fetchUserData());

// setupSocketHandlers(store);

const container = document.getElementById('root');
const root = createRoot(container as any);

root.render(
  <Providers>
    <Root />
  </Providers>,
);
