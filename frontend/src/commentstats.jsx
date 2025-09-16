import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentStats = () => {
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchstat = async () => {
            try {
                const response = await axios.get("http://localhost:8005/comment/admin/");
                setComments(response.data);
                setMessage("کامنت‌ها بارگذاری شدند");
            } catch (error) {
                setMessage("خطا در بارگذاری کامنت‌ها");
                console.error(error);
            }
        };
        fetchstat();
    }, []);

    return (
        <div>
            <h2>Comments</h2>
            {comments.map((s) => (
                <div key={s.user_id} style={{ marginBottom: "20px", borderBottom: "1px solid gray" }}>
                    <h3>👤 {s.username}</h3>
                    <p>⭐ میانگین امتیاز: {s.avarage_point}</p>

                    <h4>نظرات:</h4>
                    <ul>
                        {s.comments.map((c, i) => (
                            <li key={i}>
                                <p>{c.comment}</p>
                                <small>
                                    امتیاز: {c.point} - تاریخ: {new Date(c.created_at).toLocaleString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <h1>{message}</h1>
        </div>
    );
};

export default CommentStats;
