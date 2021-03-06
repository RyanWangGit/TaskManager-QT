import React from 'react';
import ReactDOM from 'react-dom';
import ProcessTab from './process-tab';
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reducer from "../reducers";
import thunkMiddleware from "redux-thunk";
import {processes} from "systeminformation";
import {updateProcessInfo} from "../actions/process";

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><ProcessTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders with processes', () => {
  const div = document.createElement('div');
  processes().then((procs) => store.dispatch(updateProcessInfo(procs.list)));
  ReactDOM.render(<Provider store={store}><ProcessTab /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});