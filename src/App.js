import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Index from "./pages/layout/Index";
import Page500 from "./pages/error/Page500";
import Page404 from "./pages/error/Page404";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/500" exact component={Page500} />
        <Route path="/404" exact component={Page404} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/" component={Index} />
      </Switch>
    </Router>
  );
}

export default App;
