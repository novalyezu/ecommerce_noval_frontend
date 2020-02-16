import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ProductDetail.module.css";
import { GET_PRODUCT } from "../../yecipe/redux/actions/product";
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

    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  async componentDidMount() {
    await this.handleGetProduct();
    console.log(this.state.product);
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

  handleAddToCart() {
    this.props.history.push("/cart");
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
                    <span className={`mt-0 ${styles.merchant_name}`}>
                      {this.state.product.merchant.merchant_name}
                    </span>
                    <button
                      className="btn btn-primary float-right"
                      onClick={this.handleAddToCart}
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
    product: state.product
  };
};

export default connect(mapStateToProp)(ProductDetail);
