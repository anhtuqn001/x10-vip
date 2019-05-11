import React, {
    Component
} from 'react';
import Chart from 'react-apexcharts';

function generateData(count, yrange) {
    count = 7;
    var i = 0;
    var series = [];
    while (i < count) {
        var x = (i + 1).toString();
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }
    return series;
}

var data = [{
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: '',
        data: generateData(8, {
            min: 0,
            max: 90
        })
    }
]

// data.reverse()

var colors = ["#F3B415", "#F27036", "#663F59",
     "#6A6E94", "#4E88B4", "#00A7C6", 
     "#18D8D8", '#A9D794','#46AF78', 
     '#A93F55', '#8C5E58', '#2176FF', '#33A1FD', '#7A918D', '#BAFF29']

 colors.reverse()

var options = {
    chart: {
        height: 450,
        type: 'heatmap',
        toolbar: {
            show: false
          }
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        heatmap: {
            colorScale: {
                inverse: true
            }
        }
    },
    colors: colors,
    series: data,
    xaxis: {
        type: 'category',
        categories: ['1m', '3m', '5m', '30m', '1h', '6h', '1d']
    },
    title: {
        text: 'HeatMap',
        align: 'center'
    },
    grid: {
        padding: {
            right: 20
        }
    }
}


class ChartHeatMap extends Component {

    constructor(props) {
        super(props);
       
    }

    render() {
        return (<Chart 
            options={options} series={data} type="heatmap" height={350} />);
    }
}

export default ChartHeatMap;