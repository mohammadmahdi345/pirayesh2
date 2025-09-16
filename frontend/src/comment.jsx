
import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import Input from "./input"

const Comment = () => {
  const [comments, setComments] = useState({ description: "", point: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const schema = yup.object().shape({
    description: yup.string().required("کامنت الزامی است"),
    point: yup.number().required("امتیاز الزامی است").min(1).max(5),
  });

  const validate = async () => {
    try {
      const result = await schema.validate(comments);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    const result = await validate();
    if (result) {
      try {
        await axios.post("http://localhost:8005/comment/", result);
        setMessage("نظر و امتیاز با موفقیت ارسال شد");
        setError("");
      } catch (err) {
        setError("خطایی رخ داد");
      }
    }
  };

  return (
    <div>
      <h2>به عملکرد آرایشگر کامنت و امتیاز بده</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handelSubmit}>
        <Input
          type="text"
          value={comments.description}
          name="comment"
          onChange={(e) =>
            setComments({ ...comments, description: e.target.value })
          }
          label="کامنت"
        />
        <Input
          type="number"
          value={comments.point}
          name="point"
          onChange={(e) =>
            setComments({ ...comments, point: e.target.value })
          }
          label="امتیاز"
        />
        <button type="submit">ارسال</button>
      </form>
    </div>
  );
};

export default Comment;
