import { combineReducers } from "redux";

import authentication from "./authentication";
import product from "./product";
import cart from "./cart";
import payment from "./payment";

const appReducer = combineReducers({
  authentication,
  product,
  cart,
  payment
});

export default appReducer;
