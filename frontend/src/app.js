import React, { Component } from 'react';
import Users from './users';
import Navbar from './navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './home';
import Register from './register';
import Login from './login';
import User from './user';
import NotFound from './notfound';
import Dashboard from './dashboard';
import Logout from './logout';
import axios from 'axios';
import Protect from './protect';
import Search from './search';
import Appointment from './appointmentchange';
import Appointmentadmin from './appointmentadmin';
import Appointmentadmin1 from './appopk';
import Off from './off';
import Appointments from './appoint';
import Admins from './admins';
import Comment from './comment';
import CommentStats from './commentstats';
import CommentAllStats from './commentallstat';
import TimeSlots from './timeslots';
import Payment from './payment';
import './mahmud.css'

class App extends Component {
    state = {
        user:null, 
    }


    async componentDidMount() {
    const token = localStorage.getItem('token');
    console.log(token);

    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    if (!token) {
        this.setState({ user: null });
        return;
    }

    try {
        const response = await axios.get('http://localhost:8005/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // چون response.data خودش کاربره
        this.setState({ user: response.data });
        console.log(this.state.user);

    } catch (error) {
        console.log('Error fetching user:', error);
        this.setState({ user: null });
    }
}


    
    render() {
        
        return ( 
            <>
                <Navbar user={this.state.user} />
                <div>
                    <Routes>
                        <Route path="/users/:id" element={<User />} />
                        <Route path="/admins" element={<Admins user={this.state.user} />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/payment/:pk" element={<Payment />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/comment/admin" element={<CommentStats />} />
                        <Route path="/comment/admin/all" element={<CommentAllStats />} />
                        <Route path="/comment" element={<Comment />} />
                        <Route path="/appointment/cancelled/" element={<Appointment />} />
                        <Route path="/appointment/" element={<Appointments />} />
                        <Route path="/appointment/admin/" element={<Appointmentadmin />} />
                        <Route path="/appointment/admin/:pk" element={<Appointmentadmin1 />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/search/:name" element={<Search />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/off" element={<Off />} />
                        <Route path="/timeslot" element={<TimeSlots />} />
                        <Route path="/dashboard" element={<Protect><Dashboard /></Protect>} />
                        <Route path="/notefound" element={<NotFound />} />
                        <Route path="/" element={<Home />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </div>
            </>
        );
    }  
}

export default App;
