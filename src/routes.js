

import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Brand from "views/examples/Brand.js";

import Banner from "views/examples/Banner.js";
import Blog from "views/examples/Blog.js";
import Cart from "views/examples/Cart.js";
import Category from "views/examples/Category.js";
import Contact from "views/examples/Contact.js";
import Product from "views/examples/Product.js";
import CartItem from "views/examples/CartItem.js";
import Order from "views/examples/Order";
import OrderDetail from "views/examples/OrderDetail.js";
import Payment from "views/examples/Payment.js";
import User from "views/examples/User.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/banner",
    name: "Banner",
    icon: "ni ni-planet text-blue",
    component: <Banner />,
    layout: "/admin",
  },

  {
    path: "/blog",
    name: "Blog",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Blog />,
    layout: "/admin",
  },
  {
    path: "/brand",
    name: "Brand",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Brand />,
    layout: "/admin",
  },
  {
    path: "/cart",
    name: "Cart",
    icon: "ni ni-planet text-blue",
    component: <Cart/>,
    layout: "/admin",
  },
  {
    path: "/cartitem",
    name: "CartItem",
    icon: "ni ni-planet text-blue",
    component: <CartItem/>,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "Category",
    icon: "ni ni-planet text-blue",
    component: <Category/>,
    layout: "/admin",
  },

  {
    path: "/contact",
    name: "Contact",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Contact/>,
    layout: "/admin",
  },
  {
    path: "/product",
    name: "Product",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Product/>,
    layout: "/admin",
  },
  {
    path: "/order",
    name: "Order",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Order/>,
    layout: "/admin",
  },

  {
    path: "/orderdetail",
    name: "OrderDetail",
    icon: "ni ni-bullet-list-67 text-red",
    component: <OrderDetail/>,
    layout: "/admin",
  },
  {
    path: "/payment",
    name: "Payment",
    icon: "ni ni-planet text-blue",
    component: <Payment/>,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User",
    icon: "ni ni-planet text-blue",
    component: <User/>,
    layout: "/admin",
  },

  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
