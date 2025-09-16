import React, { Component } from 'react';
import './mahmud.css';
import { Link } from 'react-router-dom';
import Search from './search';

class Navbar extends Component {
    render() {
        const { user } = this.props;

        return (
            <>
                <ul className='navbar'>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/users">users</Link></li>

                    {/* اگر کاربر لاگین نکرده */}
                    {!user && (
                        <>
                            <li><Link to="/login">login</Link></li>
                            <li><Link to="/register">register</Link></li>
                        </>
                    )}

                    {/* اگر کاربر لاگین کرده */}
                    {user && (
                        <>
                            <li><Link to="/dashboard">dashboard</Link></li>
                            <li><Link to="/logout">logout</Link></li>
                            <li><Link to="/appointment">appointment</Link></li>

                            {/* فقط ادمین‌ها */}
                            {user.is_staff && (
                                <>
                                    <li><Link to="/admins">admin</Link></li>
                                </>
                            )}
                        </>
                    )}

                    <li className="search-container">
                        <Search />
                    </li>
                </ul>
            </>
        );
    }
}

export default Navbar;
