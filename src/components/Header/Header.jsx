import { ThemeOption } from "../ThemeOption";
import styles from "./Header.module.css";
import { NavBar } from "../NavBar/NavBar";
import { BurgerButton } from "../BurgerButton";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Routes } from "../../constants";

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header>
            <div className={styles.container}>
                <div className={styles.containerLogo}>
                    <NavLink to={Routes.HOME}>
                        <img src="/logo-dark.svg" alt="logo" className={styles.logo} />
                    </NavLink>

                </div>
                <ThemeOption isOpen={isNavOpen} />
                <NavBar isOpen={isNavOpen} />
                <BurgerButton onClick={toggleNav} isOpen={isNavOpen} />
            </div>
        </header>
    )
}