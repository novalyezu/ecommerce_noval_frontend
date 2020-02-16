import React, { Component } from "react";
import styles from "./Product.module.css";
import { formatRupiah } from "../../yecipe/functions/formatRupiah";
import { truncateString } from "../../yecipe/functions/truncateString";

export class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { data } = this.props;
    return (
      <div className="col-md-8 mx-auto">
        <div className="card mb-3">
          <div className="row no-gutters">
            <div className="col-md-4">
              <img
                src={data.product_image}
                className="card-img"
                alt={data.product_name}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5
                  className={`card-title ${styles.title_hover}`}
                  onClick={() =>
                    this.props.history.push(`/product/${data.id_product}`)
                  }
                >
                  {data.product_name}
                </h5>
                <p className="card-text">{truncateString(data.description)}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Rp {formatRupiah(data.price.toString())}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
