import { combineReducers } from "redux";

import authentication from "./authentication";
import product from "./product";
import cart from "./cart";

const appReducer = combineReducers({
  authentication,
  product,
  cart
});

export default appReducer;
