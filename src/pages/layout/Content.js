import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import routes from "../../yecipe/routes";

export class Content extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <Switch>
            {routes.map((data, id) => {
              return (
                <Route
                  key={id}
                  path={data.path}
                  exact={data.exact}
                  component={data.component}
                ></Route>
              );
            })}
          </Switch>
        </div>
        {/* <!-- /.content --> */}
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default Content;
