import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { Routes } from "../../constants";

export const NavBar = () => {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to={Routes.HOME}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={Routes.TRANSACTIONS}>
                        Transactions
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}