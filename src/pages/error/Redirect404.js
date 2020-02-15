import React, { Component } from "react";
import { connect } from "react-redux";

class Redirect404 extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.history.push("/404");
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    authentication: state.authentication
  };
};

export default connect(mapStateToProp)(Redirect404);
