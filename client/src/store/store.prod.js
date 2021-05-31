import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/index';
import { socketMiddlware } from '../utils/socket';

export default (initState) =>
  createStore(
    reducers,
    initState,
    compose(applyMiddleware(thunk, socketMiddlware))
  );
