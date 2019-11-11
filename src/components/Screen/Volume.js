import React, {Component} from 'react';
import BarOption from './ChartOptions/BarOption';
import Chart from 'react-apexcharts';
import {getDataPointValue, formatNumber} from './ChartOptions/BarStackedPctOption';
import { format } from 'util';

const Volume = ({name,volume}) => (<div className="h3 pt-3">
    <p className="title">{name}</p>
    <p className="m-3">{volume}</p>
</div>);

const VolumeBar = ({name, volume, chartOptions}) => {
    var options = Object.assign({}, {...BarOption}, chartOptions || {});
    options.xaxis.categories = [name];
    
    let series = [{data: [parseFloat(volume)]}];

    return (<div className="h3">
        <p className="title">{name}</p>
        <Chart options={options} series={series} type="bar" height={50} />
    </div>);
};

const VolumeRate = ({name, rate}) => (<div className="h3 pt-3">
     <p>{name}</p>
    <div  className={rate > 0? "green": "red"} >
        {rate}%
    </div>
</div>);


const formatVolume = (value, opt) => {

    const val = getDataPointValue(opt);
    return parseFloat(val).toFixed(2);
};

const chartStackedOptions = {
    chart: {
        stacked: true,
        stackType: '100%',
        width: '100%',
        type: 'bar',
        toolbar: {
            show: false
        },
          sparkline: {
            enabled: true,
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'center', // top, center, bottom
                hideOverflowingLabels: false 
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
  		offsetX: 1,
        textAnchor: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            colors: ['#ffffff']
        },
    },
    tooltip: {
        shared: false,
        enabled: false,
    },
    xaxis: {
        type: 'category',
        categories: ['Trend'],
    },
}

const VolumeBarStacked = ({series}) => {
    return (<div >
        <p className="h4">Trends</p>
        <Chart options={chartStackedOptions} series={series} type="bar" height={50}/>
    </div>);
}

export {Volume, VolumeBar, VolumeRate, VolumeBarStacked};