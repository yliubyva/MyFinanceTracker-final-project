import { Outlet } from "react-router-dom";
import { NavBar } from "../../components/NavBar/NavBar";
import { Background } from "../../components/Background";
import styles from "./Root.module.css";

export const Root = () => {
    return ( 
    <div>
        <Background />
        <NavBar />
        <main>
            <Outlet />
        </main>
    </div>
    )
}