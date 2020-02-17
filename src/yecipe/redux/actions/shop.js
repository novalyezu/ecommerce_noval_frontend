import axios from "axios";
import config from "../../configs/index";

export const REGISTER_SHOP = (data, token) => {
  return {
    type: "REGISTER_SHOP",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/merchants/register`,
      data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const GET_SHOP_OWNER = (user_id, token) => {
  return {
    type: "GET_SHOP_OWNER",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/merchants/${user_id}/owner`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const GET_SHOP = (merchant_id, token) => {
  return {
    type: "GET_SHOP",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/merchants/${merchant_id}/detail`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const GET_PRODUCT_BY_SHOP = (merchant_id, token) => {
  return {
    type: "GET_PRODUCT_BY_SHOP",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/products/by_merchant/${merchant_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const ADD_PRODUCT = (data, token) => {
  return {
    type: "ADD_PRODUCT",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/products/add_new`,
      data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
