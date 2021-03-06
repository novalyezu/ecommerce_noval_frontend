const initialState = {
  data: [],
  productDetail: {},
  isLoading: false,
  error: {
    name: "",
    message: ""
  }
};

const product = (state = initialState, action) => {
  switch (action.type) {
    //GET_PRODUCTS
    case "GET_PRODUCTS_PENDING":
      return { ...state, isLoading: true };
    case "GET_PRODUCTS_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_PRODUCTS_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.data = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //GET_PRODUCT
    case "GET_PRODUCT_PENDING":
      return { ...state, isLoading: true };
    case "GET_PRODUCT_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_PRODUCT_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.productDetail = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default product;
