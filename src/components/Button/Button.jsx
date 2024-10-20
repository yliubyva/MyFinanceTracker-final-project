import PropTypes from "prop-types";
import styles from "./Button.module.css";

export const Button = ({ onClick, text, children }) => {
    return (
        <button onClick={onClick} className={styles.button}>
            {children ? children : text}
        </button>
    )
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string,
    children: PropTypes.node,
}