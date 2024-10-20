import { Outlet } from "react-router-dom";
import { NavBar } from "../../components/NavBar/NavBar";
import styles from "./Root.module.css";

export const Root = () => {
    return <div>
        <NavBar />
        <main>
            <Outlet />
        </main>
    </div>
}