
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Appointment = () => {
    const [appo,setAppo] = useState([])
    const [message,setmessage] = useState('')
    const [error, setError] = useState('');

    
    useEffect(() => {
    fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:8005/Appointments/');
            setAppo(response.data);
            console.log(response.data)
        } catch (err) {
            setError("User not found.");
        }
    };

    const handelclick = async (pk) => {
        try {
            const response = await axios.patch(`http://localhost:8005/Appointments/cancelled/${pk}/`);
            await fetchUser();
            console.log(response.data);
            setmessage('با موفقیت کنسل شد');
            // اینجا دوباره لیست آپدیت میشه 
        } catch (error) {
            setmessage('خطایی رخ داد');
            console.log(error);
        }
    };

    return ( 
        <>
        <div>
        <h1>از این صفحه نوبت خود را کنسل کنید</h1>
        {appo.map(a=>(
            <div key={a.id}>
                <h1>{a.user.username}</h1>
                <h2>{a.hairstyle.name}</h2>
                <h4>{a.date}</h4>
                <h4>{a.time_slot}</h4>
                <button onClick={()=>handelclick(a.pk)}>cancell</button>
            </div>
        ))}
        </div>
        <h2>{message}</h2>
        </>
     );
}

export default Appointment ;