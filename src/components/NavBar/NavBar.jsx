import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { Routes } from "../../constants";
import HomeIcon from "../../assets/Home.svg?react";
import WalletIcon from "../../assets/Wallet.svg?react";
import SettingsIcon from "../../assets/Settings.svg?react";
import MoveIcon from "../../assets/Move.svg?react";

export const NavBar = ({ isOpen }) => {
    return (
        <div className={styles.container}>
            <nav className={`${styles.navigation} ${isOpen ? styles.show : styles.unshow}`}>
                <ul className={styles.navPages}>
                    <li>
                        <NavLink to={Routes.HOME} className={({ isActive }) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                        >
                            <HomeIcon className={styles.icon} />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={Routes.TRANSACTIONS} className={({ isActive }) =>
                            isActive ? `${styles.link} ${styles.active}` : styles.link
                        }
                        >
                            <WalletIcon className={styles.icon} />
                        </NavLink>
                    </li>
                </ul>
                <ul className={styles.settings}>
                    <li>
                        <span className={styles.soon}>
                            <SettingsIcon className={styles.icon} />
                        </span>
                    </li>
                    <li>
                        <span className={styles.soon}>
                            <MoveIcon className={styles.icon} />
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    )
};

NavBar.propTypes = {
    isOpen: PropTypes.bool,
};