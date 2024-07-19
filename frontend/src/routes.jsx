import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import {action as loginAction} from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import AuthForm from "./pages/AuthForm";
import MemberPage from "./pages/MemberPage";
import NotMemberPage from "./pages/NotMemberPage";
import LogoutPage, {action as logoutAction} from "./pages/LogoutPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/login',
                element: <AuthForm />,
                action: loginAction
            },
            {
                path: '/member',
                element: <MemberPage />
            },
            {
                path: '/not-member',
                element: <NotMemberPage />
            },
            {
                path: '/logout',
                element: <LogoutPage />,
                loader: logoutAction
            }
        ],
        errorElement: <ErrorPage />
    }
])