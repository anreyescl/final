import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import axios from "./Axios";
import Logo from "./Logo";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import * as io from "socket.io-client";
import { init } from "./socket";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

if (location.pathname != "/welcome") {
    init(store);
}
const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

let component;

if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = elem;
}

ReactDOM.render(component, document.querySelector("main"));
