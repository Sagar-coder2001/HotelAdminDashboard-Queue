import React, { useEffect, useState } from 'react';
import '../Dashboard/Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import { useLocation } from 'react-router-dom';
import '../../Pages/Table-Dashboard/Table_dashboard.css';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';

const Table_dashboard = () => {
    const location = useLocation();
    const [alluserdata, setAllUserdata] = useState([]);
    const [actable, setAcTable] = useState([]);  // AC tables
    const [nonactable, setNonAcTable] = useState([]);  // NON-AC tables  
    const [openModal, setOpenModal] = useState(false);
    const [tablesize, setTableSize] = useState('');
    const [tabletype, setTableType] = useState('');
    const [openaddedpop, setopenaddedpop] = useState(false);
    const [showmsg, setShowMsg] = useState('');
    const [delpopbox, setdelpopbox] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState(null); // Separate state for username
    const [confirmTableType, setConfirmTableType] = useState(null);
    const [useraddloading, setauseraddloading] = useState(false)

    const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);

    const bgcolor = useSelector((state) => state.theme.navbar);
    const textcolor = useSelector((state) => state.theme.textcolor);

    const modalbg = useSelector((state) => state.theme.modal);


    useEffect(() => {
        const fetchData = async () => {
            if (!username || !token) {
                return;
            }

            const formData = new FormData();
            formData.append('username', username);
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
    }, [token, username]);



    const userlogoutpopbox = (user, table_type) => {
        setdelpopbox(true);
        setConfirmUsername(user);  // Set username to state
        setConfirmTableType(table_type);
    };

    const handleConfirmDelete = () => {
        if (confirmUsername && confirmTableType !== null) {
            userlogout(confirmUsername, confirmTableType); // Pass both values to the deletion function
        }
        setdelpopbox(false);
        setconfirmdel(null);
    };

    const handleCancelDelete = () => {
        setdelpopbox(false);
        setconfirmdel(null);
    };

    const userlogout = async (user, table_type) => {
        setauseraddloading(true)
        // let tableTypeValue = table_type === '0' ? 0 : 1;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('token', token);
        formData.append('table_size', user);
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
            window.location.reload();
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Error: ' + error.message);
        }
        finally {
            setauseraddloading(true)
        }

    };

    const addTableUser = () => {
        console.log("add");
        setOpenModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setauseraddloading(true);
        setOpenModal(false);
        let tableTypeValue = tabletype === '0' ? 0 : 1;
        const formData = new FormData();
        formData.append('username', username);
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
                window.location.reload();
            }
            console.log(data);
            setTableSize('');
            setTableType('');

        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error: ' + error.message);
        }
        finally {
            setauseraddloading(false)
        }
    };





    setTimeout(() => {
        setopenaddedpop(false)
    }, 4000);


    const columns = [
        {
            name: <div className='heading'>Sr. No</div>,
            selector: (row, index) => <><div className='srno'>{index + 1}</div></>,  // Dynamically display serial number
            sortable: true,
        },
        {
            name: <div className='heading'>Table Size</div>,
            selector: (row) =>  <><div className='srno'>{row.table_size}</div></>,
            sortable: true,
        },
        {
            name: <div className='heading'>Table Type</div>,
            selector: (row) =>  <><div className='srno'>{row.type === 1 ? 'AC' : 'NON-AC'}</div></> ,
            sortable: true,
        },
        {
            name: <div className='heading'>Action</div>,
            cell: (row) => (
                <span
                    onClick={() => userlogoutpopbox(row.table_size, row.type)}
                    style={{ cursor: 'pointer' }}
                    className='srno'
                >
                   <i className="fa-solid fa-trash text-danger srno"></i>
                </span>
            ),
        },
    ];

    const data = [
        ...actable.map((item) => ({ table_size: item, type: 1 })),
        ...nonactable.map((item) => ({ table_size: item, type: 0 })),
    ];


    return (
        <Layout>
            <Admindashboard />
            <div className='dashboard-container'>
                <div className="employee-table" style={{ marginTop: '50px' }} >
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

                    {
                        useraddloading && (
                            <>
                                <div className="loader-overlay delpopup">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </>
                        )
                    }

                    {openModal && (
                        <div className="user-details-card text-center" style={{ backgroundColor: modalbg, color: textcolor }}>
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
                                            <option value="1">AC</option>
                                            <option value="0">NON AC</option>
                                        </select>
                                    </div>
                                </div>
                                <hr />
                                <div className="input-group row mb-3">
                                    <span className='queuefetchbtn col-4 m-auto' style={{ margin: '0px 25px', borderRadius: '4px', cursor: 'pointer' }} onClick={handleSubmit}>Submit</span>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="employee-table" style={{backgroundColor: modalbg, color: textcolor, width:'100%', height:'auto', marginTop:'20px', borderRadius:'6px'}}>
                    <div className="table-container" style={{padding:'20px 0px'}} >
                    
                        <DataTable
                         title={<span style={{fontSize: '24px', fontWeight: 'bold' }}>Table Managment </span>}
                            columns={columns}
                            data={data}
                            pagination
                            paginationPerPage={10} 
                            striped
                            responsive
                            highlightOnHover
                            paginationComponentOptions={{
                                noRowsPerPage: true
                            }}
                        />
                    </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Table_dashboard;
