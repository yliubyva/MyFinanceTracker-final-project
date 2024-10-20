import { createBrowserRouter } from "react-router-dom";
import { Root } from "./layouts/Root/Root";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Transactions } from "./pages/Transactions/Transactions";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
            {
                path: "transactions/",
                Component: Transactions,
            },
        ]
    },
]);