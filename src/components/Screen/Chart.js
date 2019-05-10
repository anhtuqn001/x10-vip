import React, {Component} from 'react';
import Chart from 'react-apexcharts';

const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(number);
}

const keys = [60, 180, 300, 1800, 3600, 21600, 86400];
const  SCALE = 50;

class VolumeChart extends Component {
    constructor(props) {
        super(props);

        const formatVolume = (value, { seriesIndex, dataPointIndex, w }) => {
            var rate = keys[dataPointIndex] / 60;
            return formatNumber(Math.abs(value * rate * SCALE));
        };

        this.state = {
            chartOptions: {
                chart: {
                    stacked: true,
                    width: '100%',
                    type: 'bar',
                    toolbar: {
                        show: false
                      }
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
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '100%',
                        dataLabels: {
                            position: 'bottom', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: formatVolume,
                    style: {
                        colors: ['#333']
                    },
                    offsetX: 10
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
                    min: -7,
                    max: 7,
                    title: {
                        // text: 'Age',
                    },
                },
                tooltip: {
                    shared: false,
                    x: {
                        formatter: function (val) {
                            return val
                        }
                    },
                    y: {
                        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                            var rate = keys[dataPointIndex] / 60;
                            return formatNumber(Math.abs(val * rate * SCALE));
                        }
                    }
                },
                title: {
                    // text: 'Expectation'
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
        };
    }

    render() {
        return (<Chart 
            options={this.state.chartOptions} 
            series={this.props.series} 
            type="bar" height={350} />);
    }
}

export default VolumeChart;

