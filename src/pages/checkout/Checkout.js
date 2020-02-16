import React, { Component } from "react";
import { connect } from "react-redux";
// import styles from "./Checkout.module.css";
import { formatRupiah } from "../../yecipe/functions/formatRupiah";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";
import { GET_PAYMENT_METHOD, PAY } from "../../yecipe/redux/actions/payment";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      payment_method_selected: "",
      payment_methods: []
    };

    this.handlePay = this.handlePay.bind(this);
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined) {
      this.props.history.push("/404");
    } else {
      this.setState({
        isLoading: false
      });
      this.handleGetPaymentMethods();
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

  // GET_PAYMENT_METHOD
  async getPaymentMethods() {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(GET_PAYMENT_METHOD(token));
  }

  async handleGetPaymentMethods() {
    this.setState({
      isLoading: true
    });
    await this.getPaymentMethods()
      .then(async () => {
        this.setState({
          isLoading: false,
          payment_methods: this.props.payment.dataPaymentMethods
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
        } else if (this.props.payment.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleGetPaymentMethods();
        } else {
          console.log(err);
        }
      });
  }

  // PAY
  async requestPay() {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(
      PAY(
        this.state.payment_method_selected,
        this.props.authentication.data.data.id_user,
        this.props.history.location.state.cart,
        token
      )
    );
  }

  async handleRequestPay() {
    this.setState({
      isLoading: true
    });
    await this.requestPay()
      .then(async () => {
        this.setState({
          isLoading: false,
          payment_methods: []
        });
        alert("Berhasil! silahkan lakukan pembayaran anda!");
        this.props.history.push("/check_payment", {
          dataPayment: this.props.payment.data
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
        } else if (this.props.payment.error.name === "TokenExpired") {
          await this.handleRefreshToken();
          await this.handleRequestPay();
        } else {
          console.log(err);
        }
      });
  }

  async handlePay() {
    if (this.state.payment_method_selected !== "") {
      await this.handleRequestPay();
    } else {
      alert("Pilih metode pembayaran!");
    }
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div className="text-center mt-4 mv-4">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8 mx-auto mt-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="mb-4">
                    <strong>Pilih Metode Pembayaran</strong>
                    {this.state.payment_methods.map((data, index) => {
                      return (
                        <div
                          className="custom-control custom-radio"
                          key={index}
                        >
                          <input
                            type="radio"
                            id={`customRadio${index}`}
                            className="custom-control-input"
                            value={data.id_payment_method}
                            checked={
                              parseInt(this.state.payment_method_selected) ===
                              data.id_payment_method
                            }
                            onChange={e => {
                              console.log(e.target.value);
                              this.setState({
                                payment_method_selected: e.target.value
                              });
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`customRadio${index}`}
                          >
                            {data.payment_method_name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-2 mt-4">
                    <strong>Total</strong>
                    <strong className="float-right text-success">
                      Rp{" "}
                      {formatRupiah(
                        this.props.history.location.state.grand_total.toString()
                      )}
                    </strong>
                  </div>
                  <button
                    className="btn btn-success btn-block"
                    onClick={this.handlePay}
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    authentication: state.authentication,
    cart: state.cart,
    payment: state.payment
  };
};

export default connect(mapStateToProp)(Checkout);
