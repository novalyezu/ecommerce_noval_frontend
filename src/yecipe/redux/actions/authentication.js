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
