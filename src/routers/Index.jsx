import { Route } from "react-router-dom";
import HomePage from "../pages/home/Index";
import MovieDetailPage from "../pages/movie-detail/Index";
import HomeTemplate from "../templates/HomeTemplate";
import AuthTemplate from "../templates/AuthTemplate";
import LoginPage from "../pages/login/Index";
import RegisterPage from "../pages/register/Index";
import AuthCheck from "../HOC/AuthCheck";
import AdminHomePage from "../pages/admin/home/Index";
import AdminTemplate from "../templates/AdminTemplate";
import TicketMoviePage from "../pages/ticket/Index";
import AdminMoviePage from "../pages/admin/movie/index";
// Thêm import trang Admin Ticket
import AdminTicketPage from "../pages/admin/ticket/index";
import AdminTheaterPage from "../pages/admin/theater";
import UserInfoPage from "../pages/info-user";


const routers = [
    {
        path: "",
        element: <HomeTemplate />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "/detail/:movieID",
                element:
                    <AuthCheck isNeedLogin={true}>
                        <MovieDetailPage />
                    </AuthCheck>
            },
            {
                path: "/ticket/:showTimeID",
                element:
                    <AuthCheck isNeedLogin={true}>
                        <TicketMoviePage />
                    </AuthCheck>
            },
            {
                path: "/info",
                element: (
                    <AuthCheck isNeedLogin={true}>
                        <UserInfoPage />
                    </AuthCheck>
                ),
            },
        ],
    },
    {
        path: "",
        element: <AuthTemplate />,
        children: [
            {
                path: "/login",
                element:
                    <AuthCheck>
                        <LoginPage />
                    </AuthCheck>,
            },
            {
                path: "/register",
                element:
                    <AuthCheck isNeedLogin={false}>
                        <RegisterPage />
                    </AuthCheck>,
            },
        ],
    },
    {
        path: "admin",
        element:
            <AuthCheck isNeedLogin={true} roles={["QuanTri"]}>
                <AdminTemplate />
            </AuthCheck>,
        children: [
            {
                path: "", // Trang chủ admin
                element:
                    <AuthCheck isNeedLogin={true} roles={["QuanTri"]}>
                        <AdminHomePage />
                    </AuthCheck>
            },
            {
                path: "movie", // Trang quản lý phim
                element:
                    <AuthCheck isNeedLogin={true} roles={["QuanTri"]}>
                        <AdminMoviePage />
                    </AuthCheck>
            },
            {
                path: "ticket", // Trang quản lý phim
                element:
                    <AuthCheck isNeedLogin={true} roles={["QuanTri"]}>
                        <AdminTicketPage />
                    </AuthCheck>
            },
            {
                path: "theater", // Trang quản lý phim
                element:
                    <AuthCheck isNeedLogin={true} roles={["QuanTri"]}>
                        <AdminTheaterPage />
                    </AuthCheck>
            }
        ]
    }
];

export const renderRoutes = () => {
    return routers.map((template, index) => {
        return (
            <Route key={index} path={template.path} element={template.element}>
                {template.children.map((item, indexchildren) => {
                    return (
                        <Route key={indexchildren} path={item.path} element={item.element} />
                    );
                })}
            </Route>
        );
    });
};