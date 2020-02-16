import axios from "axios";
import config from "../../configs/index";

export const GET_CART = (user_id, token) => {
  return {
    type: "GET_CART",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/orders/detail/by_user/${user_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const MIN_ITEM = (order_item_id, order_id, token) => {
  return {
    type: "MIN_ITEM",
    payload: axios({
      method: "DELETE",
      url: `${config.url_dev}/orders/delete_item/${order_item_id}`,
      data: {
        total_item: 1,
        order_id: order_id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const DELETE_ORDER = (order_id, token) => {
  return {
    type: "DELETE_ORDER",
    payload: axios({
      method: "DELETE",
      url: `${config.url_dev}/orders/delete_order/${order_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const ADD_TO_CART = (orderData, token) => {
  return {
    type: "ADD_TO_CART",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/orders/add_item`,
      data: {
        total_item: orderData.total_item,
        merchant_id: orderData.merchant_id,
        user_id: orderData.user_id,
        qty: orderData.qty,
        sub_total: orderData.sub_total,
        product_id: orderData.product_id,
        order_id: orderData.order_id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const UPDATE_QTY = (qty, sub_total, order_item_id, token) => {
  return {
    type: "UPDATE_QTY",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/orders/update_qty/${order_item_id}`,
      data: {
        qty: qty,
        sub_total: sub_total
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
