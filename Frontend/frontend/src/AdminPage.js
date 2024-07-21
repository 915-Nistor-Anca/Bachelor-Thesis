import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditChange = (event) => {
    setEditingUser({
      ...editingUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewUserChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveUser = async (user) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/users/${user.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      } else {
        console.error('Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/users/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        fetchUsers();
        setNewUser({ username: '', password: '', email: '' });
      } else {
        console.error('Error adding user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-h2">Admin Page</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Username</th>
              <th className="admin-th">Email</th>
              <th className="admin-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="admin-td">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editingUser.username}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="admin-td">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      name="email"
                      value={editingUser.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="admin-td">
                  {editingUser && editingUser.id === user.id ? (
                    <button
                      className="admin-button admin-button-save"
                      onClick={() => handleSaveUser(editingUser)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="admin-button admin-button-edit"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="admin-button admin-button-delete"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="admin-h3">Add New User</h3>
      <form className="admin-form" onSubmit={handleAddUser}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleNewUserChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleNewUserChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleNewUserChange}
        />
        <button className="admin-button" type="submit">Add User</button>
      </form>
      {/* <div>
        <Link className="admin-link" to="/mainuserpage">Back to Main Page</Link>
      </div> */}
    </div>
  );
}

export default AdminPage;
