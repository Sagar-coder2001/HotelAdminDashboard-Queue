import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Import ArcElement for pie chart
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2'; // Corrected Pie import
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for pie charts
);

const Admindashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'AC People',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Non-AC People',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Total People',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });
  const navigate = useNavigate();

  const [pieData, setPieData] = useState({
    labels: ['AC People', 'Non-AC People', 'Total People'],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
    }],
  });

  const [activeSection, setActiveSection] = useState('dashboard'); // Track active section

  const getLastThreeDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format YYYY-MM-DD
    }
    
    return dates.reverse(); // Return in chronological order
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/dashboard.php', {
          method: 'POST',
          body: formdata,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('API Response:', data); // Log the full API response

        const lastThreeDates = getLastThreeDates();
        console.log('Last Three Dates:', lastThreeDates); // Log the last three dates

        const acCounts = lastThreeDates.map(date => Number(data.AC[date]) || 0);
        const nonAcCounts = lastThreeDates.map(date => Number(data.Non_AC[date]) || 0);
        const totalCounts = lastThreeDates.map(date => Number(data.Total[date]) || 0);

        // Update barData with the new values
        setBarData({
          labels: lastThreeDates,
          datasets: [
            {
              label: 'AC People',
              data: acCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Non-AC People',
              data: nonAcCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Total People',
              data: totalCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        });

        // Update pieData with totals
        const totalAc = acCounts.reduce((sum, count) => sum + count, 0);
        const totalNonAc = nonAcCounts.reduce((sum, count) => sum + count, 0);
        const totalPeople = totalCounts.reduce((sum, count) => sum + count, 0);

        setPieData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [totalAc, totalNonAc, totalPeople],
          }],
        }));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [token, user]);

  const handlelogout = () => {
    localStorage.removeItem('isLoggedIn', null);
    navigate('/');
  }

  useEffect(() => {
    const s = localStorage.getItem('isLoggedIn');
    if(s === null  && s === ''){
      navigate('/');
    }
  },[])

  const renderContent = () => {
    switch (activeSection) {
      case 'queueManage':
        return (
          <div className="dashboard-container mt-5">
           te ipsam minus fuga ducimus?
          </div>
        )
      case 'dashboard':
      default:
        return (
          <div className="dashboard-container">
            <div className="upper-dashboard">
              <strong style={{ fontSize: '25px' }}>Welcome!</strong>
              <h3 style={{ textAlign: 'center' }}>Hotel Admin Dashboard</h3>
              <div className="upper">
                <div className="col4">Daily Game Visit <br /> $200</div>
                <div className="col4">Revenue<br /> $200</div>
                <div className="col4">Orders<br /> $200</div>
              </div>
            </div>
            <div className="lower">
              <div className="col6">
                <Bar
                  data={barData}
                  style={{ width: '100%', height: '100%' }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return Number.isInteger(value) ? value : ''; // Show only integers
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="col6 piechart">
                <Pie
                  data={pieData}
                  width={'400px'}
                  height={'400px'}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Show label and value
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className='sidebar-container'>
          <div className="sidebar">
            <div className="middle">
              <a href="" style={{ textAlign: 'center' }}>Company</a>
              <ul>
                <li><a href="#" onClick={() => setActiveSection('dashboard')}>Hotel</a></li>
                <li><a href="#" onClick={() => setActiveSection('queueManage')}>Queue-Manage</a></li>
                <li><a href="#">Welcome</a></li>
                <li><a href="#">Home</a></li>
                <li><a href="#">Setting</a></li>
                <li><a href="#" onClick={handlelogout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        {renderContent()} {/* Render the content based on active section */}
      </div>
    </Layout>
  );
};

export default Admindashboard;
