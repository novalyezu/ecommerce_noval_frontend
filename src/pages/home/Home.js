import React, { Component } from "react";
import { connect } from "react-redux";
import { GET_PRODUCTS } from "../../yecipe/redux/actions/product";
import Product from "./Product";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      products: [],
      sort_by_harga: "",
      start_at: 0,
      limit: 1,
      isLoadingLoadMore: false,
      loadMore: true
    };

    this.handleGetProducts = this.handleGetProducts.bind(this);
  }

  async componentDidMount() {
    await this.handleGetProducts();
  }

  // GET_PRODUCTS
  async getProducts() {
    await this.props.dispatch(
      GET_PRODUCTS(
        this.state.start_at,
        this.state.limit,
        this.state.sort_by_harga
      )
    );
  }

  async handleGetProducts() {
    this.setState({
      isLoadingLoadMore: true,
      loadMore: false
    });
    await this.getProducts()
      .then(() => {
        let reduxData = this.props.product.data;
        let start_at = this.state.products.length + reduxData.length;
        this.setState({
          start_at: start_at,
          products: [...this.state.products, ...reduxData],
          isLoading: false,
          isLoadingLoadMore: false,
          loadMore: reduxData.length < this.state.limit ? false : true
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
          <div>
            <div className="row mt-4">
              <div className="col-md-8 mx-auto">
                <div className="mb-2">
                  Urutkan Berdasarkan
                  <select
                    className="float-right"
                    onChange={async e => {
                      await this.setState({
                        sort_by_harga: e.target.value,
                        start_at: 0,
                        limit: 1,
                        products: []
                      });
                      await this.handleGetProducts();
                    }}
                  >
                    <option value="termurah">Harga Termurah</option>
                    <option value="termahal">Harga Termahal</option>
                  </select>
                </div>
                {this.state.products.map((data, index) => {
                  return (
                    <Product
                      data={data}
                      key={index}
                      history={this.props.history}
                    />
                  );
                })}
                {this.state.isLoadingLoadMore ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {this.state.loadMore ? (
                      <button
                        className="btn btn-outline-primary"
                        onClick={this.handleGetProducts}
                      >
                        load more
                      </button>
                    ) : null}
                  </div>
                )}
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
    product: state.product
  };
};

export default connect(mapStateToProp)(Home);
