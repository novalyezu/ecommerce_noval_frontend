import React, { Component } from "react";
import styles from "./Login.module.css";
import { connect } from "react-redux";

import { LOGIN } from "../../yecipe/redux/actions/authentication";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication.isLogin) {
      this.props.history.push("/");
    }
  }

  handleChangeEmail(value) {
    this.setState({
      email: value
    });
  }

  handleChangePassword(value) {
    this.setState({
      password: value
    });
  }

  handleLogin() {
    this.setState({
      isLoading: true
    });
    this.doLogin()
      .then(() => {
        this.setState({
          isLoading: false
        });
        const { authentication } = this.props;
        if (authentication.isLogin) {
          window.localStorage.setItem(
            "userData",
            JSON.stringify(authentication.data.data)
          );
          window.localStorage.setItem("token", authentication.data.token);
          window.localStorage.setItem(
            "refreshToken",
            authentication.data.refreshToken
          );
          this.props.history.push("/");
        } else {
          alert("email atau password salah!");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        if (err.message === "Network Error") {
          alert(
            "Maaf ada kesalahan pada server kami, tunggu beberapa saat dan coba lagi. \ncontact: indonesia.car.auction@gmail.com"
          );
        } else {
          alert("email atau password salah!");
        }
      });
  }

  async doLogin() {
    if (this.state.email !== "" && this.state.password !== "") {
      await this.props.dispatch(LOGIN(this.state.email, this.state.password));
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4 mx-auto mt-4">
            <div className={`card ${styles.vertical_center}`}>
              <div className="card-body">
                <h4 className="text-center">Login</h4>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="email"
                    value={this.state.email}
                    onChange={e => this.handleChangeEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={e => this.handleChangePassword(e.target.value)}
                  />
                </div>
                {this.state.isLoading ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={this.handleLogin}
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication
  };
};

export default connect(mapStateToProps)(Login);
