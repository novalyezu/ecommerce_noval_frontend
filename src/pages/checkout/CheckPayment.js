import React, { Component } from "react";
import { connect } from "react-redux";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";
import { CHECK_PAYMENT } from "../../yecipe/redux/actions/payment";

class CheckPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.handleCheckStatusPembayaran = this.handleCheckStatusPembayaran.bind(
      this
    );
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined) {
      this.props.history.push("/404");
    } else {
      this.setState({
        isLoading: false
      });
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

  // CHECK_PAYMENT
  async checkPayment() {
    let token = window.localStorage.getItem("token");
    await this.props.dispatch(
      CHECK_PAYMENT(
        this.props.history.location.state.dataPayment.id_invoice,
        token
      )
    );
  }

  async handleCheckPayment() {
    this.setState({
      isLoading: true
    });
    await this.checkPayment()
      .then(async () => {
        this.setState({
          isLoading: false
        });
        alert("Pembayaran sukses!");
        this.props.history.push("/");
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
          await this.handleCheckPayment();
        } else {
          console.log(err);
        }
      });
  }

  handleCheckStatusPembayaran() {
    this.handleCheckPayment();
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
                    <strong>Silahkan selesaikan pembayaran anda!</strong>
                  </div>
                  <button
                    className="btn btn-success btn-block"
                    onClick={this.handleCheckStatusPembayaran}
                  >
                    Check Status Pembayaran
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

export default connect(mapStateToProp)(CheckPayment);
