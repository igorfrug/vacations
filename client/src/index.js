import React from 'react';
import ReactDOM from 'react-dom';
import 'react-redux'
import { createStore, combineReducers } from 'redux'
import { loginReducer } from './redux/reducers'
import { Provider } from 'react-redux'
import './index.css';
import App from './App';

const allReducers = combineReducers({

    isLogged: loginReducer
})

const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


ReactDOM.render( < Provider store = { store } >
    <App />
    </Provider>,
    document.getElementById('root')
);