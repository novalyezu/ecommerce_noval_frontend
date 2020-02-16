import Home from "../pages/home/Home";
import ProductDetail from "../pages/product/ProductDetail";
import Redirect404 from "../pages/error/Redirect404";

const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/product/:product_id", exact: true, component: ProductDetail },
  { path: "*", exact: true, component: Redirect404 }
];

export default routes;
