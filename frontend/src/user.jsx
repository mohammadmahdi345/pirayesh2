import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const User = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // ✅ اینجا تعریفش کن
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8005/users/${id}/`);
                console.log(response.data)
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("User not found.");
            }
        };

        fetchUser();
    }, [id]);

    if (error) return <h2>{error}</h2>;

    return (
        <div>
            <h1>User ID: {id}</h1>
            <p>Username: {user.username}</p>
            <button onClick={() => navigate('/users')}>User</button> {/* ✅ اینجا */}
        </div>
    );
};

export default User;
