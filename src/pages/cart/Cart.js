import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./Cart.module.css";
import {
  GET_CART,
  MIN_ITEM,
  DELETE_ORDER,
  UPDATE_QTY,
  UPDATE_DATA_REDUX
} from "../../yecipe/redux/actions/cart";
import update from "immutability-helper";
import { formatRupiah } from "../../yecipe/functions/formatRupiah";
import { sumElementOfArray } from "../../yecipe/functions/sumElementOfArray";
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
      grand_total: 0,
      cart: [
        {
          id_order: "",
          total_item: "",
          status: "",
          merchant_id: "",
          shipping_service_id: "",
          user_id: "",
          invoice_id: "",
          shipping_service_selected: {
            id_shipping_service: "",
            service_name: "",
            service_logo: "",
            type: "",
            price: "",
            delivery_time: ""
          },
          total_order: "",
          merchant: {
            id_merchant: "",
            merchant_name: "",
            merchant_logo: "",
            description: "",
            address: "",
            open_date: "",
            user_id: "",
            shipping_service: [
              {
                id_shipping_service: "",
                service_name: "",
                service_logo: "",
                type: "",
                price: "",
                delivery_time: "",
                merchant_shipping_service: {
                  merchant_id: "",
                  shipping_service_id: ""
                }
              }
            ]
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

    this.handleOnChangeShippingService = this.handleOnChangeShippingService.bind(
      this
    );
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
      .then(async () => {
        let newArray = this.props.cart.data;
        let grand_total = 0;
        let total_shipping_fee = 0;
        for (let i = 0; i < this.props.cart.data.length; i++) {
          let total_order = sumElementOfArray(
            this.props.cart.data[i].order_item,
            "sub_total"
          );
          total_shipping_fee += this.props.cart.data[i].merchant
            .shipping_service[0].price;
          grand_total += total_order;
          let updated = update(this.props.cart.data, {
            [i]: {
              $merge: {
                shipping_service_selected: this.props.cart.data[i].merchant
                  .shipping_service[0],
                total_order: total_order
              }
            }
          });
          newArray = updated;
        }

        this.setState({
          grand_total: grand_total + total_shipping_fee,
          isLoading: false,
          cart: newArray
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

    let total_order = 0;
    for (let i = 0; i < self.state.cart[orderIndex].order_item.length; i++) {
      if (itemIndex !== i) {
        total_order += self.state.cart[orderIndex].order_item[i].sub_total;
      }
    }

    let total_shipping_fee = 0;
    let grand_total = 0;
    for (let i = 0; i < self.state.cart.length; i++) {
      if (orderIndex !== i) {
        grand_total += self.state.cart[i].total_order;
      } else {
        grand_total += total_order;
      }
      total_shipping_fee += self.state.cart[i].shipping_service_selected.price;
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
          },
          total_order: {
            $set:
              total_order +
              value *
                self.state.cart[orderIndex].order_item[itemIndex].product.price
          }
        }
      }),
      grand_total:
        grand_total +
        total_shipping_fee +
        value * self.state.cart[orderIndex].order_item[itemIndex].product.price,
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
        let grand_total =
          this.state.grand_total -
          (this.state.cart[orderIndex].total_order +
            this.state.cart[orderIndex].shipping_service_selected.price);

        this.setState({
          cart: newArray,
          grand_total: grand_total
        });
        this.props.dispatch(UPDATE_DATA_REDUX(newArray));
      } else {
        await this.handleMinItem(
          this.state.cart[orderIndex].order_item[itemIndex].id_order_item,
          this.state.cart[orderIndex].id_order
        );

        let newArray = update(this.state.cart, {
          [orderIndex]: {
            order_item: { $splice: [[itemIndex, 1]] },
            total_order: {
              $set:
                this.state.cart[orderIndex].total_order -
                this.state.cart[orderIndex].order_item[itemIndex].sub_total
            }
          }
        });

        let grand_total =
          this.state.grand_total -
          this.state.cart[orderIndex].order_item[itemIndex].sub_total;

        this.setState({
          cart: newArray,
          grand_total: grand_total
        });
        this.props.dispatch(UPDATE_DATA_REDUX(newArray));
      }
    }
  }

  handleOnChangeShippingService(orderIndex, value) {
    let valueParsed = JSON.parse(value);
    let grand_total = sumElementOfArray(this.state.cart, "total_order");
    let total_shipping_fee = 0;
    for (let i = 0; i < this.state.cart.length; i++) {
      if (orderIndex !== i) {
        total_shipping_fee += this.state.cart[i].shipping_service_selected
          .price;
      }
    }

    let newArray = update(this.state.cart, {
      [orderIndex]: {
        shipping_service_selected: {
          $set: valueParsed
        }
      }
    });
    this.setState({
      cart: newArray,
      grand_total: grand_total + valueParsed.price + total_shipping_fee
    });
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
                          <div key={orderIndex} className="mb-4">
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
                            <div className="mb-4">
                              <select
                                className="custom-select col-md-3"
                                onChange={e =>
                                  this.handleOnChangeShippingService(
                                    orderIndex,
                                    e.target.value
                                  )
                                }
                              >
                                {data.merchant.shipping_service.map(
                                  (data_ship, shipIndex) => {
                                    return (
                                      <option
                                        key={shipIndex}
                                        value={JSON.stringify(data_ship)}
                                      >
                                        {data_ship.service_name}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                              <span className="float-right">
                                {data.shipping_service_selected.delivery_time}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span>Harga Product</span>
                              <strong className="float-right">
                                Rp {formatRupiah(data.total_order.toString())}
                              </strong>
                            </div>
                            <div className="">
                              <span>Biaya Pengiriman</span>
                              <strong className="float-right">
                                Rp{" "}
                                {formatRupiah(
                                  data.shipping_service_selected.price.toString()
                                )}
                              </strong>
                            </div>
                            <hr />
                          </div>
                        );
                      })}
                      <div className="mb-4">
                        <strong>Total</strong>
                        <strong className="float-right text-success">
                          Rp {formatRupiah(this.state.grand_total.toString())}
                        </strong>
                      </div>
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
