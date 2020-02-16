import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";
import { GET_CART } from "../../yecipe/redux/actions/cart";

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.doRefreshToken = this.doRefreshToken.bind(this);
    this.handleCheckLogin = this.handleCheckLogin.bind(this);
  }

  async componentDidMount() {
    await this.handleCheckLogin();
    await this.handleGetCart();
  }

  async handleCheckLogin() {
    if (!this.props.authentication.isLogin) {
      if (!window.localStorage.getItem("refreshToken")) {
        this.props.history.push("/login");
      } else {
        const refreshToken = window.localStorage.getItem("refreshToken");
        await this.doRefreshToken(refreshToken)
          .then(() => {
            const { authentication } = this.props;
            if (authentication.isLoading && authentication.isLogin) {
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
    }
  }

  async doRefreshToken(refreshToken) {
    await this.props.dispatch(REFRESH_TOKEN(refreshToken));
  }

  // GET_CART
  async getCart() {
    let token = window.localStorage.getItem("token");
    let user_id = this.props.authentication.data.data.id_user;
    await this.props.dispatch(GET_CART(user_id, token));
  }

  async handleGetCart() {
    await this.getCart()
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
          await this.handleGetCart();
        } else {
          console.log(err);
        }
      });
  }

  render() {
    return (
      <div>
        <Header
          history={this.props.history}
          location={this.props.location}
          match={this.props.match}
        />
        <Content
          history={this.props.history}
          location={this.props.location}
          match={this.props.match}
        />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
    cart: state.cart
  };
};

export default connect(mapStateToProps)(Index);
