import React, { Component } from "react";

export class Page404 extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <h1 className="display-3 mr-4">404</h1>
            <h4 className="pt-3">We have a problem!</h4>
            <p className="text-muted">
              The page you are looking for is not found.
            </p>
            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
              click here to back home.
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Page404;
