const initialState = {
  data: [],
  isLoading: false,
  error: {
    name: "",
    message: ""
  }
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    //GET_CART
    case "GET_CART_PENDING":
      return { ...state, isLoading: true };
    case "GET_CART_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_CART_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.data = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //MIN_ITEM
    case "MIN_ITEM_PENDING":
      return { ...state, isLoading: true };
    case "MIN_ITEM_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "MIN_ITEM_FULFILLED":
      return { ...state, isLoading: false };

    //DELETE_ORDER
    case "DELETE_ORDER_PENDING":
      return { ...state, isLoading: true };
    case "DELETE_ORDER_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "DELETE_ORDER_FULFILLED":
      state.data = [];
      return { ...state, isLoading: false };

    //ADD_TO_CART
    case "ADD_TO_CART_PENDING":
      return { ...state, isLoading: true };
    case "ADD_TO_CART_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "ADD_TO_CART_FULFILLED":
      if (action.payload.data.status === "ok") {
        let resData = action.payload.data.data;
        state.data = resData;
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default cart;
