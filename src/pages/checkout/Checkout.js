import React, { Component } from "react";

class Checkout extends Component {
  render() {
    return <div></div>;
  }
}

const mapStateToProp = state => {
  return {
    authentication: state.authentication,
    cart: state.cart
  };
};

export default connect(mapStateToProp)(Checkout);
