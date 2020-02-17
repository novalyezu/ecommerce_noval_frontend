import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ShopDetail.module.css";
import { truncateString } from "../../yecipe/functions/truncateString";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";
import { GET_SHOP, GET_PRODUCT_BY_SHOP } from "../../yecipe/redux/actions/shop";
import moment from "moment";

class ShopDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isLoadingProduct: true,
      dataShop: {
        id_merchant: "",
        merchant_name: "",
        merchant_logo: "",
        description: "",
        address: "",
        open_date: "",
        user_id: ""
      },
      user_id: "",
      products: []
    };
  }

  async componentDidMount() {
    this.setState({
      merchant_id: this.props.match.params.merchant_id
    });

    await this.handleGetShop(this.props.match.params.merchant_id);
    await this.handleGetProductByShop();
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

  // GET_SHOP
  async getShop(merchant_id) {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(GET_SHOP(merchant_id, token));
  }

  async handleGetShop(merchant_id) {
    this.setState({
      isLoading: true
    });
    await this.getShop(merchant_id)
      .then(() => {
        let reduxData = this.props.shop.dataShop;
        this.setState({
          dataShop: reduxData,
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
        } else if (this.props.shop.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleGetShop(merchant_id);
        } else {
          console.log(err);
        }
      });
  }

  // GET_PRODUCT_BY_SHOP
  async getProductByShop() {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(
      GET_PRODUCT_BY_SHOP(this.state.dataShop.id_merchant, token)
    );
  }

  async handleGetProductByShop() {
    this.setState({
      isLoadingProduct: true
    });
    await this.getProductByShop()
      .then(() => {
        let reduxData = this.props.shop.dataProductsOwner;
        this.setState({
          products: reduxData,
          isLoadingProduct: false
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
        } else if (this.props.shop.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleGetProductByShop();
        } else {
          console.log(err);
        }
      });
  }

  render() {
    return (
      <div>
        <div className="row mt-4 mb-4">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-body">
                {this.state.isLoading ? (
                  <div className="text-center mt-4 mv-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="media">
                    <img
                      src={this.state.dataShop.merchant_logo}
                      className={`mr-3 ${styles.merchant_logo}`}
                      alt={this.state.dataShop.merchant_name}
                    />
                    <div className="media-body">
                      <h5 className="mt-0">
                        {this.state.dataShop.merchant_name}
                      </h5>
                      <p>{this.state.dataShop.description}</p>
                      <p className="text-muted">
                        {this.state.dataShop.address}
                      </p>
                      <p>
                        <small className="text-muted">
                          Dibuka pada tanggal
                        </small>{" "}
                        {moment(this.state.dataShop.open_date).format(
                          "DD MMMM YYYY"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {this.state.isLoadingProduct ? (
              <div className="text-center mt-4 mv-4">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <h5>Products</h5>
                <div className="row mt-2">
                  {this.state.products.map((data, index) => {
                    return (
                      <div className="col-md-4" key={index}>
                        <div className="card">
                          <img
                            src={data.product_image}
                            className="card-img-top"
                            alt={data.product_name}
                          />
                          <div className="card-body">
                            <h5
                              className={`card-title ${styles.title_hover}`}
                              onClick={() =>
                                this.props.history.push(
                                  `/product/${data.id_product}`
                                )
                              }
                            >
                              {data.product_name}
                            </h5>
                            <p className="card-text">
                              {truncateString(data.description)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
    shop: state.shop
  };
};

export default connect(mapStateToProps)(ShopDetail);
