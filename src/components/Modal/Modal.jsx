import PropTypes from "prop-types";
import styles from "./Modal.module.css";
import CloseIcon from "../../assets/Close.svg?react";

export const Modal = ({ title, children, isOpen, onClose }) => {
    if(!isOpen) {
        return null;
    }
    return (
        <div className={`${styles.modal} ${isOpen ? styles.displayBlock : styles.displayNone}`}>
            <div className={styles.modalMain}>
                <div className={styles.head}>
                    <p>{title}</p>
                    <button className={styles.button} onClick={onClose}>
                        <CloseIcon className={styles.close} />
                    </button>
                </div>
                <div className={styles.divider}></div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
}