import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Payment = () => {
    const {pk} = useParams()

    const [payment,setPayment] = useState(null)
    const [message,setMessage] = useState('')



    useEffect(()=> {
        
        const fetchpayment = async() => {
            try {
                const response = await axios.post(`http://localhost:8005/payment/${pk}/`)
                setPayment(response.data)
                setMessage('موفق')
            } catch (error) {
                setMessage('ناموفق',error)
            }
        };
        fetchpayment()
    },[])

    return ( 
        <>
        <h2>پرداحت</h2>
        {payment ? (
                <div>
                    <h2>{payment.user.username}</h2>
                    <h2>{payment.paid_at}</h2>
                    <h2>{payment.ref_id}</h2>
                </div>
            ): (
                <h1>{message}</h1>
            )}
        </>
     );
}
 
export default Payment;