import React, { useEffect, useState } from 'react';
import '../Dashboard/Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import { useLocation } from 'react-router-dom';

const Table_dashboard = () => {
    const location = useLocation();
    const { tokenid, username } = location.state || {};
    const [alluserdata, setAllUserdata] = useState([]);
    const [actable, setAcTable] = useState([]);
    const [nonactable, setNonAcTable] = useState([]);  

    const [token, setToken] = useState(tokenid || '');
    const [user, setUsername] = useState(username || '');

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !token) {
                return; 
            }

            const formData = new FormData();
            formData.append('username', user);
            formData.append('token', token);

            try {
                const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/table.php?for=get', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                console.log('table data:', data);
                setAcTable(data.AC);  // Set AC data
                setNonAcTable(data.NON_AC);  // Set NON_AC data

                // setAllUserdata(data.User);  // You can use this if you want to map general user data to the table
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error: ' + error.message);
            }
        };

        fetchData(); 
    }, [token, user]);

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
                        <h4>Table Management</h4>
                        <table className="custom-table">
                            <thead>
                                <tr style={{ backgroundColor: 'white' }}>
                                    <th style={{ padding: '10px' }}>Sr. No</th>
                                    <th>Table Size</th>
                                    <th>NON AC</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actable.length || nonactable.length ? (
                                    actable.map((emp, index) => (
                                        <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                                            <td>
                                                <span>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td>{emp}</td> 
                                            <td>{nonactable[emp] || 'AC'}</td> 
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
                                    
                                )  
                                 : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No table data found
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
