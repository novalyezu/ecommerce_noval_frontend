import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ProductDetail.module.css";
import { GET_PRODUCT } from "../../yecipe/redux/actions/product";
import { ADD_TO_CART, UPDATE_QTY } from "../../yecipe/redux/actions/cart";
import { formatRupiah } from "../../yecipe/functions/formatRupiah";

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_id: this.props.match.params.product_id,
      isLoading: false,
      product: {
        id_product: "",
        product_name: "",
        product_image: "",
        description: "",
        price: "",
        stock: "",
        is_active: "",
        merchant_id: "",
        merchant: {
          id_merchant: "",
          merchant_name: "",
          merchant_logo: "",
          description: "",
          address: "",
          open_date: "",
          user_id: ""
        }
      }
    };

    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
  }

  async componentDidMount() {
    await this.handleGetProduct();
  }

  // GET_PRODUCT
  async getProduct() {
    await this.props.dispatch(GET_PRODUCT(this.state.product_id));
  }

  async handleGetProduct() {
    this.setState({
      isLoading: true
    });
    await this.getProduct()
      .then(() => {
        let reduxData = this.props.product.productDetail;
        this.setState({
          product: reduxData,
          isLoading: false
        });
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
          console.log(err);
        }
      });
  }

  // ADD_TO_CART
  async addToCart() {
    let token = window.localStorage.getItem("token");
    let order_id = null;
    if (this.props.cart.data.length > 0) {
      let findSameMerchant = this.props.cart.data.find(obj => {
        return obj.merchant_id === this.state.product.merchant_id;
      });
      if (findSameMerchant) {
        order_id = findSameMerchant.id_order;
        let findSameProduct = findSameMerchant.order_item.find(obj => {
          return obj.product_id === this.state.product.id_product;
        });
        if (findSameProduct) {
          let qty = findSameProduct.qty + 1;
          let sub_total = findSameProduct.product.price * qty;

          await this.props.dispatch(
            UPDATE_QTY(qty, sub_total, findSameProduct.id_order_item, token)
          );
        } else {
          let orderData = {
            total_item: 1,
            merchant_id: this.state.product.merchant_id,
            user_id: this.props.authentication.data.data.id_user,
            qty: 1,
            sub_total: this.state.product.price,
            product_id: this.state.product_id,
            order_id: order_id
          };
          await this.props.dispatch(ADD_TO_CART(orderData, token));
        }
      } else {
        let orderData = {
          total_item: 1,
          merchant_id: this.state.product.merchant_id,
          user_id: this.props.authentication.data.data.id_user,
          qty: 1,
          sub_total: this.state.product.price,
          product_id: this.state.product_id,
          order_id: order_id
        };
        await this.props.dispatch(ADD_TO_CART(orderData, token));
      }
    } else {
      let orderData = {
        total_item: 1,
        merchant_id: this.state.product.merchant_id,
        user_id: this.props.authentication.data.data.id_user,
        qty: 1,
        sub_total: this.state.product.price,
        product_id: this.state.product_id,
        order_id: order_id
      };
      await this.props.dispatch(ADD_TO_CART(orderData, token));
    }
  }

  async handleAddToCart() {
    this.setState({
      isLoading: true
    });
    await this.addToCart()
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
          await this.handleAddToCart();
        } else {
          console.log(err);
        }
      });
  }

  async handleAddToCartClick() {
    await this.handleAddToCart();
    alert("Berhasil menambahkan product ke keranjang!");
  }

  render() {
    return (
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
              <img
                src={this.state.product.product_image}
                className="card-img-top"
                alt={this.state.product.product_name}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {this.state.product.product_name}
                </h5>
                <p className="card-text">{this.state.product.description}</p>
                <div className="card-text">
                  <h4 className="text-muted">
                    Rp {formatRupiah(this.state.product.price.toString())}
                  </h4>
                </div>
                <hr />
                <div className="media">
                  <img
                    src={this.state.product.merchant.merchant_logo}
                    className={`mr-3 ${styles.merchant_logo}`}
                    alt={this.state.product.merchant.merchant_name}
                  />
                  <div className="media-body">
                    <span
                      className={`mt-0 ${styles.merchant_name}`}
                      onClick={() =>
                        this.props.history.push(
                          `/shop/detail/${this.state.product.merchant_id}`
                        )
                      }
                    >
                      {this.state.product.merchant.merchant_name}
                    </span>
                    <button
                      className="btn btn-primary float-right"
                      onClick={this.handleAddToCartClick}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    authentication: state.authentication,
    product: state.product,
    cart: state.cart
  };
};

export default connect(mapStateToProp)(ProductDetail);
