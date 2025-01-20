import { Doughnut } from "react-chartjs-2";
import { colorsForChartDoughnut } from "../../constants";
import 'chart.js/auto';
import PropTypes from "prop-types";
import styles from "./Charts.module.css";

const noDataPlugin = {
    id: 'noDataPlugin',
    beforeDraw: (chart) => {
        const { datasets } = chart.data;
        const hasData = datasets.some((dataset) => dataset.data.some((value) => value !== 0));

        if (!hasData) {
            const ctx = chart.ctx;
            const { width, height } = chart;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px Arial';
            ctx.fillStyle = '#888';
            ctx.fillText('No data available', width / 2, height / 2);
            ctx.restore();
        }
    },
};

export const ChartDoughnut = ({ labels, titleChart, dataForChart, titleOptions }) => {
    const data = {
        labels,
        datasets: [
            {
                label: titleChart,
                data: dataForChart,
                backgroundColor: colorsForChartDoughnut,
                borderColor: ['rgba(255, 255, 255, 0.1)'],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: false,
            title: {
                display: true,
                text: titleOptions,
            },
        },
    };
    return <div className={styles.container}>
        <Doughnut data={data} options={options} plugins={[noDataPlugin]} />
    </div>
}

ChartDoughnut.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    titleChart: PropTypes.string.isRequired,
    dataForChart: PropTypes.arrayOf(PropTypes.number).isRequired,
    titleOptions: PropTypes.string.isRequired,
}