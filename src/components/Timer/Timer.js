import React, { useState, useEffect } from "react";
import './Timer.css';
var interval;
var seconds = 0;
var hours = 0;
var minutes = 0 ;
const Timer = () => {
    const [time, setTime] = useState('Time Elapsed   00:00:00');
    useEffect(() => {
        interval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
                if (minutes === 60)
                {
                    minutes = 0;
                    hours++;
                }
            }
            var timeString = '';
            if (hours < 10) timeString += '0' + hours+':';
            else timeString += hours+':';
            if (minutes < 10) timeString += '0' + minutes + ':';
            else timeString += minutes += minutes + ':';
            if (seconds < 10) timeString += '0' + seconds;
            else timeString += seconds;
            setTime("Time Elapsed   "+timeString);
        }, 999);
        return (() => {
            clearInterval(interval);
        });
    }, []);
    return <span className='timer'>{time }</span>;
};
export default Timer;
