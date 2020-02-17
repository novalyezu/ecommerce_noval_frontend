import { createStore, applyMiddleware } from "redux";
// import { createLogger } from "redux-logger";
import promiseMiddleware from "redux-promise-middleware";

import reducers from "./reducers/index";

// const logger = createLogger({});

const store = createStore(reducers, applyMiddleware(promiseMiddleware));

export default store;
