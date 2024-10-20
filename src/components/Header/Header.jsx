import { ThemeOption } from "../ThemeOption/ThemeOption";
import styles from "./Header.module.css";
import { NavBar } from "../NavBar/NavBar";
import { BurgerButton } from "../BurgerButton/BurgerButton";
import { useState } from "react";

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header>
            <div className={styles.container}>
                <div className={styles.containerLogo}>
                    <img src="/logo-dark.svg" alt="logo" className={styles.logo} />
                </div>
                <ThemeOption isOpen={isNavOpen} />
                <NavBar isOpen={isNavOpen} />
                <BurgerButton onClick={toggleNav} isOpen={isNavOpen} />
            </div>
        </header>
    )
}