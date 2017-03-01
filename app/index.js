import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
var SocketIoClient = require("socket.io-client");

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

console.log(SocketIoClient);
var socket = SocketIoClient("http://localhost:3000/", { transports: ['websocket'] });
socket.on("stdin", function(msg){console.log(msg);});
console.log("socket.io initialized");

