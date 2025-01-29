import PropTypes from "prop-types";
import styles from "./Confirmation.module.css";

export const Confirmation = ({ onDelete, onClose }) => {
    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <button onClick={onDelete} className={`${styles.button} ${styles.confirm}`}>Confirm</button>
                <button onClick={onClose} className={`${styles.button} ${styles.cancel}`}>Cancel</button>
            </div>
        </div>
    )
}

Confirmation.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}