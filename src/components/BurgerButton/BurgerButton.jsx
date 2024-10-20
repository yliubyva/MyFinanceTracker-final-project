import PropTypes from "prop-types";
import styles from "./BurgerButton.module.css";

export const BurgerButton = ({ onClick, isOpen }) => {
    return (
        <button onClick={onClick} className={`${styles.burger} ${isOpen ? styles.open : ''}`}>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
        </button>
    )
}

BurgerButton.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}