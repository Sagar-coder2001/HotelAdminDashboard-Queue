import React, { useEffect, useState } from 'react';
import '../Dashboard/Admindashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement 
} from 'chart.js';
import {  Bar, Pie } from 'react-chartjs-2'; 
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
import { useLocation } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import { useSelector } from 'react-redux';

const Hotel_dashboard = () => {

const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);


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
        backgroundColor: 'rgba(55, 99, 132, 0.5)',
      },
      {
        label: 'Total People',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });
  const location = useLocation();
  const navigate = useNavigate();

  // const { tokenid, username } = location.state || {}; 
  // const [token, setToken] = useState(tokenid || ''); 
  // const [user, setUser] = useState(username || '');


  const [pieData, setPieData] = useState({
    labels: ['AC People', 'Non-AC People', 'Total People'],
    datasets: [{
      data: [
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(55, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
    }],
  });


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
        if (!token || !username) {
          throw new Error('User credentials are missing');
        }

        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', username);

        const response = await fetch('http://192.168.1.11/Queue/Hotel_Admin/dashboard.php', {
          method: 'POST',
          body: formdata,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('API Response:', data);

        if(data.Authentication === false){
          navigate('/');
        }

        const lastThreeDates = getLastThreeDates();
        console.log('Last Three Dates:', lastThreeDates);

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
              backgroundColor: 'rgba(55, 99, 132, 0.5)',
            },
            {
              label: 'Total People',
              data: totalCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        });

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
  }, []);

  return (
      <Layout>
    <Admindashboard/>
    <div className="dashboard-container">
      <div className="upper-dashboard mt-5">
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
            width={100}
            height={100}
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
    </Layout>
  );
};

export default Hotel_dashboard;
