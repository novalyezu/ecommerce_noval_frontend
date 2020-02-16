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
      if (action.payload.data.status === "ok") {
        // let findSameOrder = state.data.find(obj => {
        //   return obj.id_order === parseInt(action.payload.data.data.order_id);
        // });
        // let findIndexProduct = findSameOrder.order_item.findIndex(obj => {
        //   return (
        //     obj.id_order_item ===
        //     parseInt(action.payload.data.data.order_item_id)
        //   );
        // });
        // findSameOrder.order_item.splice(findIndexProduct, 1);
        // Object.assign(findSameOrder, {
        //   total_item: action.payload.data.data.total_now
        // });
      }
      return { ...state, isLoading: false };

    //UPDATE_DATA_REDUX
    case "UPDATE_DATA_REDUX":
      state.data = action.payload.data;
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
      if (action.payload.data.status === "ok") {
        // let findIndexOrder = state.data.findIndex(obj => {
        //   return obj.id_order === parseInt(action.payload.data.data.order_id);
        // });
        // state.data.splice(findIndexOrder, 1);
      }
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
        let findSameOrder = state.data.find(obj => {
          return obj.id_order === action.payload.data.data.id_order;
        });
        if (findSameOrder) {
          Object.assign(findSameOrder, action.payload.data.data);
        } else {
          state.data = [...state.data, resData];
        }
      }
      return { ...state, isLoading: false };

    //UPDATE_QTY
    case "UPDATE_QTY_PENDING":
      return { ...state, isLoading: true };
    case "UPDATE_QTY_REJECTED":
      if (action.payload.response) {
        state.error = action.payload.response.data;
      }
      return { ...state, isLoading: false };
    case "UPDATE_QTY_FULFILLED":
      if (action.payload.data.status === "ok") {
        let findSameOrder = state.data.find(obj => {
          return obj.id_order === parseInt(action.payload.data.data.order_id);
        });
        let findSameProduct = findSameOrder.order_item.find(obj => {
          return (
            obj.id_order_item ===
            parseInt(action.payload.data.data.order_item_id)
          );
        });
        Object.assign(findSameProduct, {
          qty: action.payload.data.data.qty,
          sub_total: action.payload.data.data.sub_total
        });
      }
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default cart;
