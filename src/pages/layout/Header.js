import React, { Component } from "react";
import styles from "./Header.module.css";
import { connect } from "react-redux";
import { LOGOUT } from "../../yecipe/redux/actions/authentication";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      role: ""
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleBukaToko = this.handleBukaToko.bind(this);
  }

  async componentDidMount() {
    await this.checkUserData();
  }

  async checkUserData() {
    if (this.props.authentication.data.data !== undefined) {
      this.setState({
        name: this.props.authentication.data.data.name,
        role: this.props.authentication.data.data.role
      });
    } else {
      setTimeout(() => {
        this.checkUserData();
      }, 500);
    }
  }

  handleLogout() {
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    this.props.dispatch(LOGOUT());
    this.props.history.push("/login");
  }

  handleBukaToko() {
    if (this.state.role === "customer") {
      this.props.history.push("/shop/register");
    } else {
      this.props.history.push("/shop");
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">
              NovalCommerce
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles.button_transparent}`}
                    onClick={() => this.props.history.push("/cart")}
                  >
                    Cart
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.name}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <button className="dropdown-item">Profile</button>
                    <button
                      className="dropdown-item"
                      onClick={this.handleBukaToko}
                    >
                      Buka Toko
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={this.handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authentication: state.authentication
  };
};

export default connect(mapStateToProps)(Header);
