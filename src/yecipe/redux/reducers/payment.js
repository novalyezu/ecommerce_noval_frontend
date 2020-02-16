const initialState = {
  data: [],
  dataPaymentMethods: [],
  isLoading: false,
  error: {
    name: "",
    message: ""
  }
};

const payment = (state = initialState, action) => {
  switch (action.type) {
    //GET_PAYMENT_METHOD
    case "GET_PAYMENT_METHOD_PENDING":
      return { ...state, isLoading: true };
    case "GET_PAYMENT_METHOD_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "GET_PAYMENT_METHOD_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.dataPaymentMethods = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //PAY
    case "PAY_PENDING":
      return { ...state, isLoading: true };
    case "PAY_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "PAY_FULFILLED":
      if (action.payload.data.status === "ok") {
        state.data = action.payload.data.data;
      }
      return { ...state, isLoading: false };

    //CHECK_PAYMENT
    case "CHECK_PAYMENT_PENDING":
      return { ...state, isLoading: true };
    case "CHECK_PAYMENT_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "CHECK_PAYMENT_FULFILLED":
      if (action.payload.data.status === "ok") {
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default payment;
