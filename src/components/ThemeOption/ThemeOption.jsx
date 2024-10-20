import React, { useState } from 'react';
import styles from "./ThemeOption.module.css";
import LightIcon from "../../assets/Light.svg?react";
import DarkIcon from "../../assets/Dark.svg?react";
import PropTypes from 'prop-types';

export const ThemeOption = ({ isOpen }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        document.querySelector('body').setAttribute('data-theme', selectedTheme);
    }

    return ( 
        <div className={`${styles.themeOptions} ${isOpen ? styles.show : styles.unshow}`}>
            <div
                onClick={() => toggleTheme('light')}
                className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
            >
                <LightIcon className={styles.icon} />
            </div>
            <div
                onClick={() => toggleTheme('dark')}
                className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
            >
                <DarkIcon className={styles.icon}  />
            </div>
        </div>
    )
}

ThemeOption.propTypes = {
    isOpen: PropTypes.bool,
}