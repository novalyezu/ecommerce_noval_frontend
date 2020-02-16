import axios from "axios";
import config from "../../configs/index";

export const LOGIN = (email, password) => {
  return {
    type: "LOGIN",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/auth/signin`,
      data: {
        email: email,
        password: password
      }
    })
  };
};

export const REGISTER = data => {
  return {
    type: "REGISTER",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/auth/signup`,
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        role: "customer",
        address: data.address
      }
    })
  };
};

export const REFRESH_TOKEN = refresh_token => {
  return {
    type: "REFRESH_TOKEN",
    payload: axios({
      method: "POST",
      url: `${config.url_dev}/auth/refresh_token`,
      data: {
        refresh_token: refresh_token
      }
    })
  };
};

export const LOGOUT = () => {
  return {
    type: "LOGOUT"
  };
};
