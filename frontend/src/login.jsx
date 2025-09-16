import React, { Component } from "react";
import * as yup from "yup";
import axios from "axios";

class Login extends Component {
  state = {
    account: {
      username: "",
      password: ""
    },
    errors: [],
    sending: false
  };

  handelchange = (e) => {
    const input = e.currentTarget;
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account });
  };

  schema = yup.object().shape({
    username: yup.string().required("پر کردن این فیلد الزامی است"),
    password: yup
      .string()
      .min(5, "رمز عبور حداقل باید 5 حرف داشته باشد")
      .required("پر کردن این فیلد الزامی است")
  });

  validate = async () => {
    try {
      const result = await this.schema.validate(this.state.account, {
        abortEarly: false
      });
      return result;
    } catch (error) {
      this.setState({ errors: error.errors });
    }
  };

  handelsubmit = async (e) => {
    e.preventDefault();
    const result = await this.validate();
    if (result) {
      try {
        this.setState({ sending: true });
        const response = await axios.post("http://localhost:8005/login/", result);
        localStorage.setItem("token", response.data.tokens.access_token);
        window.location.href = "/dashboard"; // ریدایرکت بعد از لاگین
        this.setState({ sending: false });
      } catch (error) {
        this.setState({
          sending: false,
          errors: ["نام کاربری یا رمز عبور صحیح نمیباشد"]
        });
      }
    }
  };

  render() {
    const { username, password } = this.state.account;
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>

          {this.state.errors.length !== 0 && (
            <div className="error">
              <ul>
                {this.state.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={this.handelsubmit}>
            <div className="form-class">
              <label htmlFor="username">Username</label>
              <input
                onChange={this.handelchange}
                value={username}
                name="username"
                id="username"
                type="text"
              />
            </div>

            <div className="form-class">
              <label htmlFor="password">Password</label>
              <input
                onChange={this.handelchange}
                value={password}
                name="password"
                id="password"
                type="password"
              />
            </div>

            <button className="login" disabled={this.state.sending}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
