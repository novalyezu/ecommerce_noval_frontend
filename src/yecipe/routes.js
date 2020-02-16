import Home from "../pages/home/Home";
import ProductDetail from "../pages/product/ProductDetail";
import Redirect404 from "../pages/error/Redirect404";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import CheckPayment from "../pages/checkout/CheckPayment";

const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/product/:product_id", exact: true, component: ProductDetail },
  { path: "/cart", exact: true, component: Cart },
  { path: "/checkout", exact: true, component: Checkout },
  { path: "/check_payment", exact: true, component: CheckPayment },
  { path: "*", exact: true, component: Redirect404 }
];

export default routes;
