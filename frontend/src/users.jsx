import React, { Component } from 'react';
import axios from 'axios';
import './mahmud.css';
import Loading from './loading';
import { Link } from 'react-router-dom';

class Users extends Component {
  state = {
    users: [],
    hairstyle: [],
    is_loading: true,
  };

  async componentDidMount() {
  try {
    const response1 = await axios.get('http://localhost:8005/users');
    console.log("Users fetched:", response1.data);
    const response2 = await axios.get('http://localhost:8005/hairs/');
    this.setState({
      hairstyle: response2.data,
      users: response1.data,
      is_loading: false,
});
  } catch (error) {
    console.error("خطا در دریافت اطلاعات:", error);
  }
}

  render() {
  return (
    this.state.is_loading ? (
      <Loading />
    ) : (
      <div className="mahmud">
        <button onClick={this.handleCreate} className="create">create</button>

        {this.state.users.map((user, index) => (
          <div className="faraz" key={index}>
            <h4>{user.firstname} {user.lastname}</h4>
            <Link to={`/users/${user.id}`}>
              <h5>{user.username}</h5>
            </Link>
            <button onClick={() => this.handleUpdate(user)} className="update">update</button>
            <button onClick={() => this.handleDelete(user)} className="delete">delete</button>
          </div>
        ))}
      </div>
    )
  );
}


  handleCreate = async () => {
  const newUser = {
    username: 'reza123',
    password: 'mysecurepassword',
  };

  try {
    const response = await axios.post('http://localhost:8005/register/', newUser);
    console.log('User created!', response.data);
  } catch (error) {
    console.error('Error registering user:', error);
  }
  this.setState({users:[...this.state.users,newUser]})
  console.log(this.state.users)
};

  handleUpdate = async (user) => {
    user.first_name = 'update';
    const response = await axios.put(`http://localhost:8005/hairs/${user.id}`, user);
    const updated_user = [...this.state.users];
    const index = updated_user.indexOf(user);
    updated_user[index] = {...user}
    this.setState({users:updated_user})

  }

  handleDelete = async (user) => {
    const response = await axios.delete(`http://localhost:8005/hairs/${user.id}`)
    const newusers = this.state.users.filter(u=> u.id !== user.id)
    this.setState({users:newusers})
  }
}

export default Users;