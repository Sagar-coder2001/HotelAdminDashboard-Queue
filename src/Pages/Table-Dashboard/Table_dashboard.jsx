import React, { useEffect, useState } from 'react';
import '../Dashboard/Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import { useLocation } from 'react-router-dom';
import '../../Pages/Table-Dashboard/Table_dashboard.css';

const Table_dashboard = () => {
    const location = useLocation();
    const { tokenid, username } = location.state || {};
    const [alluserdata, setAllUserdata] = useState([]);
    const [actable, setAcTable] = useState([]);  // AC tables
    const [nonactable, setNonAcTable] = useState([]);  // NON-AC tables  
    const [token, setToken] = useState(tokenid || '');
    const [user, setUsername] = useState(username || '');
    const [openModal, setOpenModal] = useState(false);
    const [tablesize, setTableSize] = useState('');
    const [tabletype, setTableType] = useState('');
    const [openaddedpop, setopenaddedpop] = useState(false);
    const [showmsg, setShowMsg] = useState('');
    const [delpopbox, setdelpopbox] = useState(false);
    const [confirmdel, setconfirmdel] = useState(false);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [tablesPerPage] = useState(10);

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

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error: ' + error.message);
            }
        };

        fetchData();
    }, [token, user]);



    const userlogoutpopbox = (username, table_type) => {
        setdelpopbox(true);
        setconfirmdel(username, table_type);
    };

    const handleConfirmDelete = () => {
        userlogout(confirmdel);
        setdelpopbox(false);
        setconfirmdel(null);
    };

    const handleCancelDelete = () => {
        setdelpopbox(false);
        setconfirmdel(null);
    };

    const userlogout = async (username, table_type) => {

        // let tableTypeValue = table_type === 'AC' ? 1 : 0;

        const formData = new FormData();
        formData.append('username', user);
        formData.append('token', token);
        formData.append('table_size', username);
        formData.append('table_type', table_type)
        try {
            const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/table.php?for=remove', {
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

    const addTableUser = () => {
        console.log("add");
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpenModal(false);
        let tableTypeValue = tabletype === 'ac' ? 1 : 0;
        const formData = new FormData();
        formData.append('username', user);
        formData.append('token', token);
        formData.append('table_size', tablesize);
        formData.append('table_type', tableTypeValue);
        try {
            const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/table.php?for=add', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit the data');
            }
            const data = await response.json();

            if (data) {
                setopenaddedpop(true);
                setShowMsg(data.Message);
            }

            if (data.Status === true) {
                setOpenModal(false);
            }
            console.log(data);
            setTableSize('');
            setTableType('');

        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error: ' + error.message);
        }
    };

    // Pagination logic
    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const currentAcTables = actable.slice(indexOfFirstTable, indexOfLastTable);
    const currentNonAcTables = nonactable.slice(indexOfFirstTable, indexOfLastTable);

    // Change page handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    const totalTables = [...actable, ...nonactable];
    for (let i = 1; i <= Math.ceil(totalTables.length / tablesPerPage); i++) {
        pageNumbers.push(i);
    }

    setTimeout(() => {
        setopenaddedpop(false)
    }, 4000);

    return (
        <Layout>
            <Admindashboard />
            <div className='mt-5 dashboard-container'>
                <div className="employee-table">
                    <div className="addbtn">
                        <button className='mt-4' onClick={addTableUser}>Add Table</button>
                    </div>
                    {
                        openaddedpop && (
                            <>
                                <div class="alert alert-primary mt-4" role="alert">
                                    {showmsg}
                                </div>
                            </>
                        )
                    }

                    {delpopbox && (
                        <div className="delpopup">
                            <div className="popup-content">
                                <p> <strong>Are you sure you want to delete this user?</strong></p>
                                <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
                                <button onClick={handleCancelDelete}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {openModal && (
                        <div className="user-details-card text-center">
                            <form>
                                <h3>
                                    Table Added
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setOpenModal(false)}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        fontSize: '1.2rem',
                                        color: 'red',
                                        cursor: 'pointer',
                                        outline: 'none',
                                    }}
                                >
                                    &#10006;
                                </button>

                                <div className="row mt-4">
                                    <label htmlFor="role" className="col-4 col-form-label text-start">Table Size</label>
                                    <div className="col-8">
                                        <input type="number" className='form-control' value={tablesize} onChange={(e) => setTableSize(e.target.value)} placeholder='2' />
                                    </div>
                                </div>
                                <hr />
                                <div className="row mt-4">
                                    <label htmlFor="role" className="col-4 col-form-label text-start">Table type</label>
                                    <div className="col-8">
                                        <select name="" id="" value={tabletype} className='form-control' onChange={(e) => setTableType(e.target.value)}>
                                            <option value="AC">AC</option>
                                            <option value="NON AC">NON AC</option>
                                        </select>
                                    </div>
                                </div>
                                <hr />
                                <div className="input-group row mb-3">
                                    <span className='queuefetchbtn col-4 m-auto' style={{ margin: '0px 5px', borderRadius: '4px', cursor: 'pointer' }} onClick={handleSubmit}>Submit</span>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="table-container">
                        <h4>Table Management</h4>
                        <table className="custom-table">
                            <thead>
                                <tr style={{ backgroundColor: 'black', color: 'white' }}>
                                    <th style={{ padding: '10px' }}>Sr. No</th>
                                    <th>Table Size</th>
                                    <th>AC / NON-AC</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAcTables.length || currentNonAcTables.length ? (
                                    <>
                                        {/* Render AC tables */}
                                        {currentAcTables.map((emp, index) => (
                                            <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                                                <td>
                                                    <span>
                                                        {index + 1 + (currentPage - 1) * tablesPerPage}
                                                    </span>
                                                </td>
                                                <td>{emp}</td>
                                                <td>AC</td>
                                                <td>
                                                    <span
                                                        className="data-bs-toggle"
                                                        data-bs-target="#exampleModal"
                                                        onClick={() => userlogoutpopbox(emp, '1')}
                                                    >
                                                        <i className="fa-solid fa-trash text-danger"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Render NON-AC tables */}
                                        {currentNonAcTables.map((emp, index) => (
                                            <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                                                <td>
                                                    <span>
                                                        {index + 1 + (currentPage - 1) * tablesPerPage}
                                                    </span>
                                                </td>
                                                <td>{emp}</td>
                                                <td>NON-AC</td>
                                                <td>
                                                    <span
                                                        className="data-bs-toggle"
                                                        data-bs-target="#exampleModal"
                                                        onClick={() => userlogoutpopbox(emp, '0')}
                                                    >
                                                        <i className="fa-solid fa-trash text-danger"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No table data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="pagination">
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={currentPage === number ? 'active' : ''}
                                    style={{ padding: '5px 8px', border: 'none', borderRadius: '2px', margin: '0px 3px' }}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Table_dashboard;
