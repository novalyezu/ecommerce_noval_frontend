import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./Cart.module.css";
import {
  GET_CART,
  MIN_ITEM,
  DELETE_ORDER,
  UPDATE_QTY
} from "../../yecipe/redux/actions/cart";
import update from "immutability-helper";
import { formatRupiah } from "../../yecipe/functions/formatRupiah";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      typingQty: false,
      typingQtyTimeout: 0,
      cart: [
        {
          id_order: "",
          total_item: "",
          status: "",
          merchant_id: "",
          shipping_service_id: "",
          user_id: "",
          invoice_id: "",
          merchant: {
            id_merchant: "",
            merchant_name: "",
            merchant_logo: "",
            description: "",
            address: "",
            open_date: "",
            user_id: ""
          },
          order_item: [
            {
              id_order_item: "",
              qty: "",
              sub_total: "",
              product_id: "",
              order_id: "",
              product: {
                id_product: "",
                product_name: "",
                product_image: "",
                description: "",
                price: "",
                stock: "",
                is_active: "",
                merchant_id: ""
              }
            }
          ]
        }
      ]
    };
  }

  async componentDidMount() {
    await this.checkUserData();
  }

  async checkUserData() {
    if (this.props.authentication.data.data !== undefined) {
      await this.handleGetCart();
    } else {
      setTimeout(() => {
        this.checkUserData();
      }, 500);
    }
  }

  // REFRESH_TOKEN
  async doRefreshToken(refreshToken) {
    await this.props.dispatch(REFRESH_TOKEN(refreshToken));
  }

  async handleRefreshToken() {
    const refreshToken = window.localStorage.getItem("refreshToken");
    await this.doRefreshToken(refreshToken)
      .then(() => {
        const { authentication } = this.props;
        if (!authentication.isLogin) {
          this.props.dispatch(LOGOUT());
          alert("Your session have expired!");
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        if (err.message === "Network Error") {
          setTimeout(() => {
            alert(
              "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
            );
            this.props.history.push("/500");
          }, 1000);
        } else {
          this.props.dispatch(LOGOUT());
          alert("Your session have expired!");
          this.props.history.push("/login");
        }
      });
  }

  // GET_CART
  async getCart() {
    let token = window.localStorage.getItem("token");
    let user_id = this.props.authentication.data.data.id_user;
    await this.props.dispatch(GET_CART(user_id, token));
  }

  async handleGetCart() {
    this.setState({
      isLoading: true
    });
    await this.getCart()
      .then(() => {
        this.setState({
          isLoading: false,
          cart: this.props.cart.data
        });
      })
      .catch(async err => {
        if (err.message === "Network Error") {
          setTimeout(() => {
            alert(
              "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
            );
            this.props.history.push("/500");
          }, 1000);
        } else if (this.props.cart.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleGetCart();
        } else {
          console.log(err);
        }
      });
  }

  // UPDATE_QTY
  async updateQty(qty, sub_total, id_order_item) {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(UPDATE_QTY(qty, sub_total, id_order_item, token));
  }

  async handleUpdateQty(qty, sub_total, id_order_item) {
    await this.updateQty(qty, sub_total, id_order_item)
      .then(() => {})
      .catch(async err => {
        if (err.message === "Network Error") {
          setTimeout(() => {
            alert(
              "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
            );
            this.props.history.push("/500");
          }, 1000);
        } else if (this.props.cart.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleUpdateQty(qty, sub_total, id_order_item);
        } else {
          console.log(err);
        }
      });
  }

  handleOnChangeQty(orderIndex, itemIndex, value) {
    const self = this;

    if (self.state.typingQtyTimeout) {
      clearTimeout(self.state.typingQtyTimeout);
    }

    self.setState({
      cart: update(self.state.cart, {
        [orderIndex]: {
          order_item: {
            [itemIndex]: {
              qty: { $set: value },
              sub_total: {
                $set:
                  value *
                  self.state.cart[orderIndex].order_item[itemIndex].product
                    .price
              }
            }
          }
        }
      }),
      typingQty: false,
      typingQtyTimeout: setTimeout(function() {
        if (self.state.cart[orderIndex].order_item[itemIndex].qty) {
          self.handleUpdateQty(
            self.state.cart[orderIndex].order_item[itemIndex].qty,
            self.state.cart[orderIndex].order_item[itemIndex].sub_total,
            self.state.cart[orderIndex].order_item[itemIndex].id_order_item
          );
        }
      }, 1000)
    });
  }

  // MIN_ITEM
  async minItem(order_item_id, order_id) {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(MIN_ITEM(order_item_id, order_id, token));
  }

  async handleMinItem(order_item_id, order_id) {
    this.setState({
      isLoading: true
    });
    await this.minItem(order_item_id, order_id)
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(async err => {
        if (err.message === "Network Error") {
          setTimeout(() => {
            alert(
              "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
            );
            this.props.history.push("/500");
          }, 1000);
        } else if (this.props.cart.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleMinItem(order_item_id, order_id);
        } else {
          console.log(err);
        }
      });
  }

  // DELETE_ORDER
  async deleteOrder(order_id) {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(DELETE_ORDER(order_id, token));
  }

  async handleDeleteOrder(order_id) {
    this.setState({
      isLoading: true
    });
    await this.deleteOrder(order_id)
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(async err => {
        if (err.message === "Network Error") {
          setTimeout(() => {
            alert(
              "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
            );
            this.props.history.push("/500");
          }, 1000);
        } else if (this.props.cart.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleDeleteOrder(order_id);
        } else {
          console.log(err);
        }
      });
  }

  async handleDeleteOrderItem(orderIndex, itemIndex) {
    if (window.confirm("Apakah yakin ingin menghapus product ini?")) {
      if (this.state.cart[orderIndex].order_item.length === 1) {
        await this.handleMinItem(
          this.state.cart[orderIndex].order_item[itemIndex].id_order_item,
          this.state.cart[orderIndex].id_order
        );
        await this.handleDeleteOrder(this.state.cart[orderIndex].id_order);
        let newArray = update(this.state.cart, { $splice: [[orderIndex, 1]] });
        this.setState({
          cart: newArray
        });
      } else {
        await this.handleMinItem(
          this.state.cart[orderIndex].order_item[itemIndex].id_order_item,
          this.state.cart[orderIndex].id_order
        );
        let newArray = update(this.state.cart, {
          [orderIndex]: { order_item: { $splice: [[itemIndex, 1]] } }
        });
        this.setState({
          cart: newArray
        });
      }
    }
  }

  render() {
    return (
      <div>
        <div className="row mt-4 mb-4">
          <div className="col-md-8 mx-auto">
            {this.state.isLoading ? (
              <div className="text-center mt-4 mv-4">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  {this.state.cart.length > 0 ? (
                    <div>
                      {this.state.cart.map((data, orderIndex) => {
                        return (
                          <div key={orderIndex}>
                            <div className="media">
                              <img
                                src={data.merchant.merchant_logo}
                                className={`mr-3 ${styles.merchant_logo}`}
                                alt={data.merchant.merchant_name}
                              />
                              <div className="media-body">
                                <span
                                  className={`mt-0 ${styles.merchant_name}`}
                                >
                                  {data.merchant.merchant_name}
                                </span>
                              </div>
                            </div>
                            <hr />
                            {data.order_item.map((data_item, itemIndex) => {
                              return (
                                <div className="media mb-4" key={itemIndex}>
                                  <img
                                    src={data_item.product.product_image}
                                    className={`mr-3 ${styles.product_image}`}
                                    alt={data_item.product.product_name}
                                  />
                                  <div className="media-body">
                                    <p
                                      className={`mt-0 ${styles.product_name}`}
                                      onClick={() =>
                                        this.props.history.push(
                                          `/product/${data_item.product.id_product}`
                                        )
                                      }
                                    >
                                      {data_item.product.product_name}
                                    </p>
                                    <div className="float-right mt-3">
                                      <strong className="mr-4 text-success">
                                        Rp{" "}
                                        {formatRupiah(
                                          data_item.sub_total.toString()
                                        )}
                                      </strong>
                                      <i
                                        className={`fa fa-trash mr-4 ${styles.icon_hover}`}
                                        onClick={() =>
                                          this.handleDeleteOrderItem(
                                            orderIndex,
                                            itemIndex
                                          )
                                        }
                                      ></i>
                                      <i
                                        className={`fa fa-minus mr-2 ${styles.icon_hover}`}
                                        onClick={() => {
                                          let value =
                                            this.state.cart[orderIndex]
                                              .order_item[itemIndex].qty - 1;
                                          this.handleOnChangeQty(
                                            orderIndex,
                                            itemIndex,
                                            value
                                          );
                                        }}
                                      ></i>
                                      <input
                                        type="number"
                                        className={`mr-2 ${styles.qty}`}
                                        value={data_item.qty}
                                        onChange={e => {
                                          this.handleOnChangeQty(
                                            orderIndex,
                                            itemIndex,
                                            e.target.value
                                          );
                                        }}
                                      />
                                      <i
                                        className={`fa fa-plus ${styles.icon_hover}`}
                                        onClick={() => {
                                          let value =
                                            this.state.cart[orderIndex]
                                              .order_item[itemIndex].qty + 1;
                                          this.handleOnChangeQty(
                                            orderIndex,
                                            itemIndex,
                                            value
                                          );
                                        }}
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                      <button
                        className="btn btn-success btn-block"
                        onClick={() => this.props.history.push("/checkout")}
                      >
                        Buy
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      Cart kamu kosong :(, ayo belanja!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    authentication: state.authentication,
    cart: state.cart
  };
};

export default connect(mapStateToProp)(Cart);
