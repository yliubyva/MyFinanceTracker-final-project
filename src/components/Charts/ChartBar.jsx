import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import styles from "./Charts.module.css";
import PropTypes from "prop-types";

export const ChartBar = ({ labels, datasets, title }) => {
    const data = {
        labels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    return <div className={styles.container}>
        <Bar data={data} options={options} />
    </div>
}

ChartBar.propTyper = {
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string),
        borderColor: PropTypes.string,
        borderWidth: PropTypes.number,
    })),
    title: PropTypes.string.isRequired,
}