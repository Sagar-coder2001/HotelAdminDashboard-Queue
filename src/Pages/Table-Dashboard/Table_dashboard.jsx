import React, { useEffect, useState } from 'react'
import '../Dashboard/Admindashboard.css'
import Layout from '../../Components/Layout/Layout'
import Admindashboard from '../Dashboard/Admindashboard'

const Table_dashboard = () => {
    // State for storing user data
    const [alluserdata, setAllUserdata] = useState([]);
    
    // Assuming you want to get the `user` and `token` values from location state
    const [user, setUser] = useState(''); // You should get this from props or location.state
    const [token, setToken] = useState(''); // Similarly, get this from props or location.state

    // Fetch data when the component mounts or when `token` or `user` change
    useEffect(() => {
        const fetchData = async () => {
            if (!user || !token) {
                return; // If user or token is not available, exit early
            }

            const formData = new FormData();
            formData.append('username', user);
            formData.append('token', token);

            try {
                const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=get', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                console.log('hotel data:', data.User);
                setAllUserdata(data.User);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error: ' + error.message);
            }
        };

        fetchData(); // Call the async function
    }, [token, user]); // Re-run the effect when token or user changes

    // You can implement the userlogout function if needed:
    const userlogout = async (username) => {
        const formData = new FormData();
        formData.append('username', user);
        formData.append('token', token);
        formData.append('delete_user', username);

        try {
            const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=remove', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to remove user');
            }

            const data = await response.json();
            console.log('User removed successfully:', data);

            // Optionally refresh user list or handle UI state
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Error: ' + error.message);
        }
    };

    return (
        <Layout>
            <Admindashboard />
            <div className='mt-5 dashboard-container'>
                <div className="employee-table">
                    <div className="table-container">
                    <h4>Table Managment</h4>
                        <table className="custom-table">
                            <thead>
                                <tr style={{ backgroundColor: 'white' }}>
                                    <th style={{ padding: '10px' }}>Sr. No</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alluserdata.length > 0 ? (
                                    alluserdata.map((emp, index) => (
                                        <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                                            <td>
                                                <span style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td>{emp.Username}</td>
                                            <td>{emp.Role}</td> {/* Adjust this field based on actual API response */}
                                            <td>
                                                <span
                                                    className="data-bs-toggle"
                                                    data-bs-target="#exampleModal"
                                                    onClick={() => userlogout(emp.Username)}
                                                >
                                                    <i className="fa-solid fa-trash text-danger"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No employees found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Table_dashboard;
