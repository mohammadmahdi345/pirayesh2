
import Users from './users';
import Navbar from './navbar';
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

import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Hair from './hairs';




function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (!token) {
      setUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const response = await axios.get("http://localhost:8005/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.log("Error fetching user:", error);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  // مسیرهایی که نوبار نباید نشون داده بشه
  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar user={user} />}
      <div>
        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/admins" element={<Admins user={user} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/hairs" element={<Hair />} />
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
          <Route
            path="/dashboard"
            element={
              <Protect>
                <Dashboard />
              </Protect>
            }
          />
          <Route path="/notefound" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
