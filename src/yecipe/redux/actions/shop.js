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
