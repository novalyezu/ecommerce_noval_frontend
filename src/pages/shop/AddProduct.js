import React, { Component } from "react";
import styles from "./AddProduct.module.css";
import { connect } from "react-redux";
import {
  REFRESH_TOKEN,
  LOGOUT
} from "../../yecipe/redux/actions/authentication";
import { ADD_PRODUCT } from "../../yecipe/redux/actions/shop";

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_image: "",
      product_image_value: "",
      product_name: "",
      description: "",
      price: "",
      stock: "",
      user_id: "",
      merchant_id: ""
    };

    this.handleSaveProduct = this.handleSaveProduct.bind(this);
    this.doSaveProduct = this.doSaveProduct.bind(this);
  }

  async componentDidMount() {
    this.setState({
      merchant_id: this.props.match.params.merchant_id
    });
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
      if (this.props.authentication.data.data.role === "merchant") {
        this.setState({
          user_id: this.props.authentication.data.data.id_user
        });
      } else {
        this.props.history.push("/shop/register");
      }
    } else {
      setTimeout(() => {
        this.checkUserData();
      }, 500);
    }
  }

  async handleSaveProduct() {
    this.setState({
      isLoading: true
    });
    await this.doSaveProduct()
      .then(() => {
        this.setState({
          isLoading: false
        });
        alert("Berhasil menambahkan product!");
        this.props.history.push("/shop");
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
          await this.handleSaveProduct();
        } else {
          console.log(err);
        }
      });
  }

  async doSaveProduct() {
    if (
      this.state.product_image !== "" &&
      this.state.product_name !== "" &&
      this.state.description !== "" &&
      this.state.price !== "" &&
      this.state.stock !== ""
    ) {
      let token = window.localStorage.getItem("token");
      const data = new FormData();
      data.append("image_app", this.state.product_image);
      data.append("product_name", this.state.product_name);
      data.append("description", this.state.description);
      data.append("price", this.state.price);
      data.append("stock", this.state.stock);
      data.append("merchant_id", this.state.merchant_id);

      await this.props.dispatch(ADD_PRODUCT(data, token));
    } else {
      alert("tolong isi semua data!");
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 mx-auto mt-4">
            <div className={`card ${styles.vertical_center}`}>
              <div className="card-body">
                <h4 className="text-center">Tambah Product</h4>
                <div className="form-group">
                  <label htmlFor="productImage">Gambar Product</label>
                  <input
                    type="file"
                    className="form-control"
                    id="productImage"
                    value={this.state.product_image_value}
                    onChange={e =>
                      this.setState({
                        product_image_value: e.target.value,
                        product_image: e.target.files[0]
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nameInput">Nama Product</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="nama product"
                    value={this.state.product_name}
                    onChange={e =>
                      this.setState({ product_name: e.target.value })
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
                  <label htmlFor="priceInput">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="priceInput"
                    placeholder="price"
                    value={this.state.price}
                    onChange={e => this.setState({ price: e.target.value })}
                  ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="stockInput">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    id="stockInput"
                    placeholder="stock"
                    value={this.state.stock}
                    onChange={e => this.setState({ stock: e.target.value })}
                  ></input>
                </div>
                {this.state.isLoading ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={this.handleSaveProduct}
                  >
                    Tambahkan
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

export default connect(mapStateToProps)(AddProduct);
