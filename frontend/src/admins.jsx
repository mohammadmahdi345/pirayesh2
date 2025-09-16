import React, { Component } from 'react';
import Appointmentadmin from './appointmentadmin';
import { Link } from 'react-router-dom';
import CommentStats from './commentstats';
import CommentAllStats from './commentallstat';

const Admins = ({user}) => {
    return ( 
        <div>
            {user?.is_staff && (
                <div className='grid-admin'>
                    <Appointmentadmin />
                    <CommentStats />
                    <CommentAllStats /> 
                </div>
            )}
        </div>
     );
}
 
export default Admins;