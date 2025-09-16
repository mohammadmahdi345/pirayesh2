import axios from "axios";
import { useEffect } from "react";
import Search from "./search";
import Appointmentadmin from "./appointmentadmin";
import TimeSlots from "./timeslots";

//axios.defaults.headers.common['token'] = localStorage.getItem('token')

const Dashboard = () => {

    /*useEffect(async()=>{
        await axios.get('url')
    },[])*/

    return ( <TimeSlots /> );
}
 
export default Dashboard;