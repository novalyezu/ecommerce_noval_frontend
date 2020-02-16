import axios from "axios";
import config from "../../configs/index";

export const GET_PAYMENT_METHOD = token => {
  return {
    type: "GET_PAYMENT_METHOD",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/payment_methods`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const PAY = (payment_method_id, user_id, order_data, token) => {
  return {
    type: "PAY",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/orders/payment`,
      data: {
        payment_method_id: payment_method_id,
        user_id: user_id,
        order_data: order_data
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const CHECK_PAYMENT = (invoice_id, token) => {
  return {
    type: "CHECK_PAYMENT",
    payload: axios({
      method: "GET",
      url: `${config.url_dev}/orders/payment/${invoice_id}/check`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
