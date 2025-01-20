import { ThemeOption } from "../ThemeOption";
import styles from "./Header.module.css";
import { NavBar } from "../NavBar/NavBar";
import { BurgerButton } from "../BurgerButton";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Routes } from "../../constants";

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navRef = useRef(null);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsNavOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <header>
            <div className={styles.container}>
                <div className={styles.containerLogo}>
                    <NavLink to={Routes.HOME}>
                        <img src="/logo-dark.svg" alt="logo" className={styles.logo} />
                    </NavLink>

                </div>
                <div ref={navRef} className={styles.navigation}>
                    <ThemeOption isOpen={isNavOpen} />
                    <NavBar isOpen={isNavOpen} />
                    <BurgerButton onClick={toggleNav} isOpen={isNavOpen} />
                </div>
            </div>
        </header>
    )
}