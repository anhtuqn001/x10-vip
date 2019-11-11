import React, {Component} from 'react';

const ThreeColumnRow = (...components) => (<div className="row justify-content-sm-center">
    <div className="col-sm-10 col-md-4 col-lg-3 text-center">
        {components[0]}
    </div>
    <div className="col-sm-10 col-md-4 col-lg-3 text-center">
        {components[1]}
    </div>
    <div className="col-sm-10 col-md-4 col-lg-3 text-center" >
        {components[2]}
    </div>
</div>
);

const OneColumnRow = (component) => (<div className="row justify-content-sm-center">
   
    <div className="col-xs-10 col-md-4 col-lg-3 text-center">
        {component}
    </div>
    
</div>
);


const TwoColumnRow = (...components) => (<div className="row justify-content-sm-center">
    <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 text-center">
        {components[0]}
    </div>
    <div className="col-sm-10 col-md-6 col-lg-4 col-xl-3 text-center">
        {components[1]}
    </div>
</div>
);


export {ThreeColumnRow , TwoColumnRow, OneColumnRow };