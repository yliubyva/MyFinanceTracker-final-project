import styles from "./ErrorPage.module.css";
import { Button } from "../../components/Button";
import { Background } from "../../components/Background";
import { NavLink } from "react-router-dom";
import { Routes } from "../../constants";

export const ErrorPage = () => {
    return (
        <div>
            <Background />
            <div className={styles.container}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.description}>Oops! Page Not Found</p>
                <p className={styles.description}>It looks like the page you're looking for got lost in the balance sheet. But don't worry, we've got you covered!</p>
                <NavLink to={Routes.HOME}>
                    Back to Home page
                </NavLink>
            </div>
        </div>
    )
}