import { useState, useEffect } from 'react';
import axios from 'axios';
import TimeSlots from './timeslots';
import { useNavigate } from 'react-router-dom';

const Off = () => {
    const [hair, setHair] = useState('');
    const [date, setDate] = useState('');
    const [times, settimes] = useState([]);
    const [time, setTime] = useState('');
    const [hairs, setHairs] = useState([]);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!time) {
            setMessage("لطفاً یک تایم‌اسلات انتخاب کنید");
            return;
        }

        if (!hair) {
            setMessage("لطفاً یک مدل مو انتخاب کنید");
            return;
        }

        console.log(hair)
        try {
            const response = await axios.post('http://localhost:8005/offs/', {
                hairstyle: Number(hair),
                date: date,
                time_slot: Number(time),
            });
            console.log("response.data:", response.data)
            setMessage('نوبت با موفقیت ثبت شد');
            const pk = response.data.pk
            console.log("pk:", pk);
            navigate(`/payment/${pk}`)
            

        } catch (error) {
            setMessage('خطایی رخ داد');
            console.error(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        
        const fetchHairs = async () => {
            try {
                const response = await axios.get('http://localhost:8005/hairs/');
                setHairs(response.data);
            } catch (error) {
                console.error("Error fetching hairs:", error);
            }
        };
        fetchHairs();
    }, []);

    useEffect(() => {
        if (!date) {
            settimes([]);
            return;
        }
        const fetchSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:8005/timeslots/?date=${date}`);
                console.log("Response data:", response.data); // ← اینو ببین
                settimes(response.data);
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        };
        fetchSlots();
    }, [date]);


    return (
        <>
            
            <h1 className='off13'>برای ثبت نوبت اقدام کنید</h1>
            <form className='form13' onSubmit={handleSubmit}>
                <select
                    value={hair}
                    onChange={(e) => setHair(e.target.value)}
                >
                    <option value="">-- انتخاب مدل مو --</option>
                    {hairs.map((h) => (
                        <option key={h.pk} value={h.pk}>
                            {h.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                    <option value="">-- انتخاب تایم‌اسلات --</option>
                    {times.map((s) => (
                        <option key={s.id} value={s.id}>{s.start_time} - {s.end_time}</option>
                    ))}
                </select>

                <button className='nobat' type="submit">ثبت نوبت</button>
            </form>
            <h2>{message}</h2>
        </>
    );
};

export default Off;



