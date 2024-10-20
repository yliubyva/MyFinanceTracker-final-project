import { Bar, Doughnut } from "react-chartjs-2";
import { Loader } from "../Loader";
import styles from "./ChartContainer.module.css";
import PropTypes from "prop-types";

export const ChartContainer = ({ data, options, type, loading }) => {
    return (
        <div className={styles.container}>
            {loading ? (
                <Loader /> 
            ) : type === 'bar' ? (
                <Bar data={data} options={options} />
            ) : (
                <Doughnut data={data} options={options} />
            )}
        </div>
    )
}

ChartContainer.propTypes = {
    data: PropTypes.object,
    options: PropTypes.object,
    type: PropTypes.string,
    loading: PropTypes.bool,
}