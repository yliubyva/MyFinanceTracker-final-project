import PropTypes from "prop-types";
import styles from "./Loader.module.css";

export const Loader = ({ width, height }) => {
    return (
        <div className={styles.container}>
            <div 
            style={{width: `${width}px`, height: `${height}px`}}
            className={styles.loader} 
            >
            </div>
        </div>
    )
}

Loader.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
}