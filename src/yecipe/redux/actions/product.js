import axios from "axios";
import config from "../../configs/index";

export const GET_PRODUCTS = (start_at, limit, sort_by_harga) => {
  return {
    type: "GET_PRODUCTS",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/products?start_at=${start_at}&limit=${limit}&sort_by_harga=${sort_by_harga}`
    })
  };
};

export const GET_PRODUCT = product_id => {
  return {
    type: "GET_PRODUCT",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/products/${product_id}/detail`
    })
  };
};
