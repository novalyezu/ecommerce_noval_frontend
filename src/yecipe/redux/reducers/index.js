import { combineReducers } from "redux";

import authentication from "./authentication";
import product from "./product";
import cart from "./cart";
import payment from "./payment";
import shop from "./shop";

const appReducer = combineReducers({
  authentication,
  product,
  cart,
  payment,
  shop
});

export default appReducer;
