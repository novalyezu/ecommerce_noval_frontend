const initialState = {
  data: [],
  isLogin: false,
  isLoading: false
};

const authentication = (state = initialState, action) => {
  switch (action.type) {
    //LOGIN
    case "LOGIN_PENDING":
      return { ...state, isLoading: true };
    case "LOGIN_REJECTED":
      return { ...state, isLoading: false };
    case "LOGIN_FULFILLED":
      if (action.payload.data.status === "ok") {
        return {
          ...state,
          data: action.payload.data,
          isLogin: true,
          isLoading: false
        };
      } else {
        return { ...state, isLoading: false };
      }

    //REGISTER
    case "REGISTER_PENDING":
      return { ...state, isLoading: true };
    case "REGISTER_REJECTED":
      return { ...state, isLoading: false };
    case "REGISTER_FULFILLED":
      if (action.payload.data.status === "ok") {
      }
      return { ...state, isLoading: false };

    //REFRESH_TOKEN
    case "REFRESH_TOKEN_PENDING":
      return { ...state, isLoading: true };
    case "REFRESH_TOKEN_REJECTED":
      if (action.payload.message !== "Network Error") {
        window.localStorage.removeItem("userData");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
      }
      return { ...state, data: [], isLogin: false, isLoading: false };
    case "REFRESH_TOKEN_FULFILLED":
      if (action.payload.data.status === "ok") {
        window.localStorage.setItem("token", action.payload.data.token);
        window.localStorage.setItem(
          "refreshToken",
          action.payload.data.refreshToken
        );

        let user_data = JSON.parse(window.localStorage.getItem("userData"));
        let oldData = {
          data: user_data,
          token: action.payload.data.token,
          refreshToken: action.payload.data.refreshToken
        };
        return {
          ...state,
          data: oldData,
          isLogin: true,
          isLoading: false
        };
      } else {
        window.localStorage.removeItem("userData");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        return { ...state, data: [], isLogin: false, isLoading: false };
      }

    case "LOGOUT":
      return {
        ...state,
        data: [],
        isLogin: false,
        isLoading: false
      };

    default:
      return state;
  }
};

export default authentication;
