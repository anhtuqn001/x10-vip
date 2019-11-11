

const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(number);
}

const keys = [60, 180, 300, 1800, 3600, 21600, 86400];
const  SCALE = 50;

const getDataPointValue  = ({ seriesIndex, dataPointIndex, w }) => {
    return w.config.series[seriesIndex].data[dataPointIndex];
}

const formatVolume = (value, opt) => {
    var rate = keys[opt.dataPointIndex] / 60;
    const val = parseFloat(getDataPointValue(opt));
    return Math.abs(val * rate * SCALE).toFixed(2);
};
const chartOptions =  {
    chart: {
        stacked: true,
        stackType: '100%',
        width: '100%',
        type: 'bar',
        toolbar: {
            show: false
          }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '100%',
            barWidth: '100%',
            dataLabels: {
                position: 'center', // top, center, bottom
            },
        },
    },
    colors: ['#FF4560', '#008FFB'],
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: [],
        }
    },
    dataLabels: {
        enabled: true,
        formatter: formatVolume,
        offsetX: 0
    },
    stroke: {
        width: 1,
        colors: ["#fff"]
    },

    grid: {
        xaxis: {
            showLines: true
        }
    },
    yaxis: {
        min: -10,
        max: 10,
        title: {
            // text: 'Age',
        },
    },
    tooltip: {
        shared: false,
        enabled: false,
    },
    title: {
        text: 'Future',
        align: 'center',
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '20px',
          color:  '#263238'
        },
    },
    xaxis: {
        type: 'category',
        categories: ['1m', '3m', '5m', '30m', '1h', '6h', '1d'],
        title: {
            // text: 'Percent'
        },
        labels: {
            formatter: function (val) {
                // return Math.abs(Math.round(val)) + "%"
            }
        },
    },
}

export default chartOptions;
export {getDataPointValue, formatVolume, formatNumber};
