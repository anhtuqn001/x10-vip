import React, {Component} from 'react';

const EventItem = ({event})=>(<div>
    <span className="text-muted">{new Date(event.time).toLocaleTimeString()}</span>
    <a href={'#' + event.sender} className="font-weight-bold ml-3">
        {event.sender && event.sender.replace('_Exchange_Api', '')}
    </a>
    <span className="ml-3" className="[getCSS(event.name)]">{event.name}</span>
    <p>{event.data.msg}</p>
</div>);

export default EventItem;