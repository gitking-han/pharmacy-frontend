import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Suppliers from "views/examples/Suppliers.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Sales from "views/examples/Sales.js";
import Medicines from "views/examples/Medicines.js";
import StockManagement from "views/examples/StockManagement.js";
import ReturnMedicine from "views/examples/ReturnMedicine.js"; // ✅ NEW

var routes = (alert, showAlert) => [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/Medicines",
    name: "Medicines",
    icon: "ni ni-planet text-blue",
    component: <Medicines />,
    layout: "/admin",
  },
  {
    path: "/Suppliers",
    name: "Suppliers",
    icon: "ni ni-pin-3 text-orange",
    component: <Suppliers />,
    layout: "/admin",
  },
  {
    path: "/StockManagement",
    name: "Stock",
    icon: "ni ni-box-2 text-green",
    component: <StockManagement />,
    layout: "/admin",
  },
  {
    path: "/ReturnMedicine", // ✅ NEW
    name: "Returns",
    icon: "ni ni-curved-next text-info",
    component: <ReturnMedicine />,
    layout: "/admin",
  },
  {
    path: "/Sales",
    name: "Sales",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Sales />,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login showAlert={showAlert} />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register showAlert={showAlert} />,
    layout: "/auth",
  },
];

export default routes;
