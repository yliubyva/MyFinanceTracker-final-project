import PropTypes from "prop-types";
import styles from "./StatCard.module.css";
import { Loader } from "../Loader";

export const StatCard = ({ label, loading, value }) => {

    return (
        <div>
            <div className={styles.card}>
                <div className={styles.container}>
                    <h3 className={styles.title}>{label}:</h3>
                    {loading ? <Loader /> : <h3 className={styles.info}>{ value }</h3>}
                </div>
            </div>
        </div>
    )
}

StatCard.propTypes = {
    label: PropTypes.string,
    loading: PropTypes.bool,
    value: PropTypes.node,
}