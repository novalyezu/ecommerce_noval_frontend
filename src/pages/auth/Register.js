import React, { Component } from "react";
import styles from "./Register.module.css";
import { connect } from "react-redux";

import { LOGIN, REGISTER } from "../../yecipe/redux/actions/authentication";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      phone_number: "",
      address: ""
    };

    this.handleToLogin = this.handleToLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication.isLogin) {
      this.props.history.push("/");
    }
  }

  handleRegister() {
    this.setState({
      isLoading: true
    });
    this.doResgister()
      .then(() => {
        this.setState({
          isLoading: false
        });
        alert("Register berhasil, silahkan login!");
        this.props.history.push("/login");
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
          console.log(err);
        }
      });
  }

  async doResgister() {
    if (
      this.state.email !== "" &&
      this.state.password !== "" &&
      this.state.name !== "" &&
      this.state.phone_number !== "" &&
      this.state.address !== ""
    ) {
      let data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        phone_number: this.state.phone_number,
        address: this.state.address
      };
      await this.props.dispatch(REGISTER(data));
    } else {
      alert("tolong isi semua data!");
    }
  }

  handleToLogin() {
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4 mx-auto mt-4">
            <div className={`card ${styles.vertical_center}`}>
              <div className="card-body">
                <h4 className="text-center">Register</h4>
                <div className="form-group">
                  <label htmlFor="nameInput">Name</label>
                  <input
                    type="name"
                    className="form-control"
                    id="nameInput"
                    placeholder="name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumberInput">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    id="phoneNumberInput"
                    placeholder="phone number"
                    value={this.state.phone_number}
                    onChange={e =>
                      this.setState({ phone_number: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
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
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="addressInput">Phone Number</label>
                  <textarea
                    className="form-control"
                    id="addressInput"
                    placeholder="address"
                    value={this.state.address}
                    onChange={e => this.setState({ address: e.target.value })}
                  ></textarea>
                </div>
                {this.state.isLoading ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={this.handleRegister}
                  >
                    Sign up
                  </button>
                )}
                <div className="mt-2">
                  <button
                    onClick={this.handleToLogin}
                    className={styles.btn_register}
                  >
                    i have an account.
                  </button>
                </div>
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

export default connect(mapStateToProps)(Register);
