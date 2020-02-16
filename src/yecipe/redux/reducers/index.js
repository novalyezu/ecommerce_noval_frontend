import { combineReducers } from "redux";

import authentication from "./authentication";
import product from "./product";

const appReducer = combineReducers({
  authentication,
  product
});

export default appReducer;
