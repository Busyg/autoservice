import Orders from "../pages/Orders/Orders.jsx";
import Clients from "../pages/Clients/Clients.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Services from "../pages/Services/Services.jsx";
import Storage from "../pages/Storage/Storage.jsx";
import Login from "../pages/Login/Login.jsx";
import Users from "../pages/Users/Users.jsx";
//Создаем пути перехода по вкладкам
const routes = [
    {path: "/", name: "Dashboard", component: Dashboard},
    {path: "/orders", name: "Orders", component: Orders},
    {path: "/clients", name: "Clients", component: Clients},
    {path: "/services", name: "Services", component: Services},
    {path: "/storage", name: "Storage", component: Storage},
    {path: "/users", name: "Users", component: Users},
    {path: "/login", name: "Login", component: Login},
];

export default routes;