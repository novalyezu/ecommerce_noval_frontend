import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.doRefreshToken = this.doRefreshToken.bind(this);
    this.handleCheckLogin = this.handleCheckLogin.bind(this);
  }

  componentDidMount() {
    this.handleCheckLogin();
  }

  handleCheckLogin() {
    if (!this.props.authentication.isLogin) {
      if (!window.localStorage.getItem("refreshToken")) {
        this.props.history.push("/login");
      } else {
        const refreshToken = window.localStorage.getItem("refreshToken");
        this.doRefreshToken(refreshToken)
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
    authentication: state.authentication
  };
};

export default connect(mapStateToProps)(Index);
