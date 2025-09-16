

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Appointmentadmin = () => {
    const [appo, setappo] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8005/Appointments/all/');
                setappo(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="admin-container">
            <h1>رزرو مدنظر خود را انتخاب کنید</h1>
            <ul className="appointment-list">
                {appo.map((a, i) => (
                    <li key={i} className="appo-item">
                        <Link to={`/appointment/admin/${a.pk}`}>
                            username : {a.user.username}<br/>
                            status : {a.status}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appointmentadmin;
