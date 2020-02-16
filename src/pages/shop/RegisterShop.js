import React, { Component } from "react";
import styles from "./RegisterShop.module.css";
import { connect } from "react-redux";
import { REGISTER_SHOP } from "../../yecipe/redux/actions/shop";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";

class RegisterShop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      merchant_logo: "",
      merchant_logo_value: "",
      merchant_name: "",
      description: "",
      address: "",
      user_id: ""
    };

    this.handleRegister = this.handleRegister.bind(this);
    this.doResgister = this.doResgister.bind(this);
  }

  async componentDidMount() {
    await this.checkUserData();
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

  async checkUserData() {
    if (this.props.authentication.data.data !== undefined) {
      this.setState({
        user_id: this.props.authentication.data.data.id_user
      });
    } else {
      setTimeout(() => {
        this.checkUserData();
      }, 500);
    }
  }

  async handleRegister() {
    this.setState({
      isLoading: true
    });
    await this.doResgister()
      .then(() => {
        this.setState({
          isLoading: false
        });
        alert("Register toko berhasil! Silahkan login kembali!");
        this.props.dispatch(LOGOUT());
        this.props.history.push("/login");
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
          await this.handleRegister();
        } else {
          console.log(err);
        }
      });
  }

  async doResgister() {
    if (
      this.state.merchant_logo !== "" &&
      this.state.merchant_name !== "" &&
      this.state.description !== "" &&
      this.state.address !== ""
    ) {
      let token = window.localStorage.getItem("token");
      const data = new FormData();
      data.append("image_app", this.state.merchant_logo);
      data.append("merchant_name", this.state.merchant_name);
      data.append("description", this.state.description);
      data.append("address", this.state.address);
      data.append("user_id", this.state.user_id);

      await this.props.dispatch(REGISTER_SHOP(data, token));
    } else {
      alert("tolong isi semua data!");
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4 mx-auto mt-4">
            <div className={`card ${styles.vertical_center}`}>
              <div className="card-body">
                <h4 className="text-center">Daftarkan Toko</h4>
                <div className="form-group">
                  <label htmlFor="logoToko">Logo Toko</label>
                  <input
                    type="file"
                    className="form-control"
                    id="logoToko"
                    value={this.state.merchant_logo_value}
                    onChange={e =>
                      this.setState({
                        merchant_logo_value: e.target.value,
                        merchant_logo: e.target.files[0]
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nameInput">Nama Toko</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="nama toko"
                    value={this.state.merchant_name}
                    onChange={e =>
                      this.setState({ merchant_name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descInput">Description</label>
                  <textarea
                    className="form-control"
                    id="descInput"
                    placeholder="description"
                    value={this.state.description}
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="addressInput">Address</label>
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
                    Daftarkan
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
    authentication: state.authentication,
    shop: state.shop
  };
};

export default connect(mapStateToProps)(RegisterShop);
