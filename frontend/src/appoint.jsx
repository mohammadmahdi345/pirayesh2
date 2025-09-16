import React, { Component } from 'react';
import Off from './off';
import Appointment from './appointmentchange';
import Appointmentadmin from './appointmentadmin';
import { Link } from 'react-router-dom';

class Appointments extends Component {

    render() { 
        return (
            <div className='grid'>
                <div className='grid-off'>
                    <Link to={'/off'}>ثبت نوبت</Link>
                </div>

                <div className='grid-cancell'>
                    <Link to={'/appointment/cancelled'}>کنسل کردن نوبت</Link>
                </div>

                
            </div>
        );
    }
}
 
export default Appointments;