import React, {Component} from 'react';
import Chart from 'react-apexcharts';

const DEFAULT_CHART_OPTION =  {
    chart: {
        height: 30,
        type: 'bar',
        sparkline: {
            enabled: true,
        }
    },
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
    yaxis: {
        min: 0,
        max: 250,
        title: {
            // text: 'Age',
        },
    },
    plotOptions: {
        bar: {
            horizontal: true,
            endingShape: 'flat',
            columnWidth: '70%',
            barHeight: '70%',
            distributed: false,
            colors: {
                ranges: [{
                    from: 0,
                    to: 0,
                    color: undefined
                }],
                backgroundBarColors: [],
                backgroundBarOpacity: 1,
            },
            dataLabels: {
                position: 'center',
                maxItems: 100,
                hideOverflowingLabels: true,
            }
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '24px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            
        },
        // offsetX: 10
    },
    // series: [{
    //     data: [0]
    // }],
    xaxis: {
        categories: [''],
    },
    
}

class BarChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // return (<Chart 
        //     options={this.state.options} 
        //     series={this.state.series} 
        //     type="radialBar" height={350} />);
        console.log(this.props);
        return (<Chart 
            {...this.props} type="bar" height={50} />);
    }
}

export default BarChart;

export {DEFAULT_CHART_OPTION};