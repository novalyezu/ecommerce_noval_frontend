const initialState = {
  data: [],
  isLoading: false,
  error: {
    name: "",
    message: ""
  }
};

const shop = (state = initialState, action) => {
  switch (action.type) {
    //REGISTER_SHOP
    case "REGISTER_SHOP_PENDING":
      return { ...state, isLoading: true };
    case "REGISTER_SHOP_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "REGISTER_SHOP_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.data = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default shop;
