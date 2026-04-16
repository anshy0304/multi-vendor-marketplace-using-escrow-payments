import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../api';

function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    const statusColors = {
        Cancelled: 'text-red-500',
        Pending: 'text-orange-500',
        Delivered: 'text-green-500'
    };
    
    const role = localStorage.getItem('role');
    
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            if (!token || !userId) {
                navigate('/login');
                return;
            }
            
            try {
                let response;
                if (role === 'Seller') {
                    response = await fetch(`${baseURL}/orders/seller/${userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {
                    response = await fetch(`${baseURL}/orders/buyer/${userId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                
                if (!response.ok) throw new Error("Could not load your orders");
                
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate, role]);

    const handleConfirmDelivery = async (orderId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${baseURL}/orders/${orderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.reload();
            } else {
                alert('Error: ' + result);
            }
        } catch (err) {
            alert("Could not connect to server");
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel the order?")) {
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${baseURL}/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.reload();
            } else {
                alert("Error: " + (result.message || result));
            }
        } catch (err) {
            alert("Could not connect to server");
        }
    };

    if (role === 'Seller') {
        return (
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>My Sales & Orders</h1>
                {loading && <p className='text-gray-500 text-xl'>Loading your Sales...</p>}
                {error && <p className='text-red-500 font-bold'>{error}</p>}
                
                <div className='space-y-4'>
                    {data.map((order) => (
                        <div key={order.id} className='bg-white p-6 rounded-lg shadow border border-gray-200 flex justify-between items-center'>
                            <div>
                                <p className='text-sm text-gray-500'>Order #{order.id}</p>
                                <h2 className='text-xl font-bold text-blue-600'>{order.product?.name || 'Product'}</h2>
                                <p className='text-lg font-semibold text-green-600'>${order.product?.price}</p>
                                <p className='mt-2 text-sm'>
                                    Status: <span className={`font-bold ${statusColors[order.status] || 'text-gray-500'}`}>
                                        {order.status === 'Pending' ? 'Action Required: Needs Shipping' : order.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {!loading && data.length === 0 && (
                        <p className='text-gray-500'>No one has ordered your products yet.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>My Orders</h1>
            {loading && <p className='text-gray-500 text-xl'>Loading your orders..</p>}
            {error && <p className='text-red-500 font-bold'>{error}</p>}
            
            <div className='space-y-4'>
                {data.map((order) => (
                    <div key={order.id} className='bg-white p-6 rounded-lg shadow border border-gray-200 flex justify-between items-center'>
                        <div>
                            <p className='text-sm text-gray-500'>Order #{order.id}</p>
                            <h2 className='text-xl font-bold text-blue-600'>{order.product?.name || "Product"}</h2>
                            <p className='mt-2 text-sm'>
                                Status: <span className={`font-bold ${statusColors[order.status] || 'text-gray-500'}`}>
                                    {order.status}
                                </span>
                            </p>
                        </div>
                        
                        {order.status === 'Pending' && (
                            <div className='flex space-x-3'>
                                <button 
                                    onClick={() => handleConfirmDelivery(order.id)}
                                    className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
                                >
                                    Confirm Delivery
                                </button>
                                <button 
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                
                {!loading && data.length === 0 && (
                    <p className='text-gray-500'>You haven't bought anything yet.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;