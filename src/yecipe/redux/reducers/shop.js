const initialState = {
  dataOwner: {
    id_merchant: "",
    merchant_name: "",
    merchant_logo: "",
    description: "",
    address: "",
    open_date: "",
    user_id: ""
  },
  dataShop: {
    id_merchant: "",
    merchant_name: "",
    merchant_logo: "",
    description: "",
    address: "",
    open_date: "",
    user_id: ""
  },
  dataProductsOwner: [],
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
        state.dataOwner = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //GET_SHOP_OWNER
    case "GET_SHOP_OWNER_PENDING":
      return { ...state, isLoading: true };
    case "GET_SHOP_OWNER_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_SHOP_OWNER_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.dataOwner = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //GET_SHOP
    case "GET_SHOP_PENDING":
      return { ...state, isLoading: true };
    case "GET_SHOP_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_SHOP_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.dataShop = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //GET_PRODUCT_BY_SHOP
    case "GET_PRODUCT_BY_SHOP_PENDING":
      return { ...state, isLoading: true };
    case "GET_PRODUCT_BY_SHOP_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_PRODUCT_BY_SHOP_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.dataProductsOwner = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //ADD_PRODUCT
    case "ADD_PRODUCT_PENDING":
      return { ...state, isLoading: true };
    case "ADD_PRODUCT_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "ADD_PRODUCT_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.dataProductsOwner = [
          ...state.dataProductsOwner,
          action.payload.data.data
        ];
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default shop;
