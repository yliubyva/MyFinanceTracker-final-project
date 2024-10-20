import { Outlet } from "react-router-dom";
import { Background } from "../../components/Background";
import { Header } from "../../components/Header";
import styles from "./Root.module.css";

export const Root = () => {
    return ( 
    <div>
        <Background />
        <Header />
        <main className={styles.container}>
            <Outlet />
        </main>
    </div>
    )
}