

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Appointmentadmin1 = () => {
    const { pk } = useParams();
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setStatus(e.target.value);
    };

    const handleClick = async () => {
        try {
            await axios.patch(
                `http://localhost:8005/Appointments/admin/${pk}/`,
                { status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('✅ وضعیت با موفقیت تغییر کرد');
        } catch (error) {
            setMessage(error.response?.data?.detail || '❌ خطای ناشناخته‌ای رخ داد');
        }
    };

    return (
        <div className="admin-container">
            <h2>وضعیت رزرو را تغییر دهید</h2>
            <select className='reserv-cancell' value={status} onChange={handleChange}>
                <option value="">-- انتخاب وضعیت --</option>
                <option value="approved">تایید شده</option>
                <option value="waiting">در انتظار</option>
                <option value="cancelled">لغو شده</option>
            </select>
            <button className='reserv-cancell2' onClick={handleClick}>تغییر وضعیت</button>
            {message && <h3 className="message">{message}</h3>}
        </div>
    );
};

export default Appointmentadmin1;
