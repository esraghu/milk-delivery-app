import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define interfaces for our data structures
interface DeliveryItem {
    product_id: number;
    quantity: number;
}

interface Delivery {
    user_id: number;
    items: DeliveryItem[];
}

interface Product {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    house_number: string;
    address?: string;
    role: string;
}

interface DeliveryPersonDashboardProps {
    user?: User;
}

const DeliveryPersonDashboard: React.FC<DeliveryPersonDashboardProps> = ({ user }) => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                
                // Fetch all data in parallel
                const [deliveriesRes, productsRes, usersRes] = await Promise.all([
                    axios.get<Delivery[]>(`/deliveries/${today}`),
                    axios.get<Product[]>('/products'),
                    axios.get<User[]>('/users')
                ]);

                setDeliveries(deliveriesRes.data);
                setProducts(productsRes.data);
                setUsers(usersRes.data);

            } catch (error) {
                console.error("Error fetching data for delivery dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getProductById = (id: number) => products.find(p => p.id === id);
    const getUserById = (id: number) => users.find(u => u.id === id);

    const totalInventory = products.map(product => {
        const total = deliveries.reduce((sum, delivery) => {
            const item = delivery.items.find(i => i.product_id === product.id);
            return sum + (item ? item.quantity : 0);
        }, 0);
        return { ...product, total };
    }).filter(item => item.total > 0);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {user && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h3>🚚 Delivery Partner Dashboard</h3>
                    </div>
                    <div className="card-body">
                        <p className="mb-0">
                            <strong>🚚 Partner:</strong> {user.name} | 
                            <strong>🗺️ Route ID:</strong> {user.house_number} | 
                            <strong>📞 Contact:</strong> {user.email}
                        </p>
                    </div>
                </div>
            )}
            
            <div className="card mb-4">
                <div className="card-header">
                    <h3>🥛 Daily Inventory Summary</h3>
                </div>
                <div className="card-body">
                    {totalInventory.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {totalInventory.map(item => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {item.name}
                                    <span className="badge bg-success rounded-pill fs-6">{item.total}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>🥛 No items scheduled for delivery today.</p>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>🗺️ Today's Delivery Route</h3>
                </div>
                <div className="card-body">
                    {deliveries.length > 0 ? (
                        <div className="accordion" id="deliveryAccordion">
                            {deliveries.map((delivery) => {
                                const user = getUserById(delivery.user_id);
                                return (
                                    <div className="accordion-item" key={delivery.user_id}>
                                        <h2 className="accordion-header" id={`heading-${delivery.user_id}`}>
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${delivery.user_id}`} aria-expanded="true" aria-controls={`collapse-${delivery.user_id}`}>
                                                <strong>{user ? `${user.name} - ${user.address}` : `User ID: ${delivery.user_id}`}</strong>
                                            </button>
                                        </h2>
                                        <div id={`collapse-${delivery.user_id}`} className="accordion-collapse collapse show" aria-labelledby={`heading-${delivery.user_id}`} data-bs-parent="#deliveryAccordion">
                                            <div className="accordion-body">
                                                <ul className="list-group">
                                                    {delivery.items.map((item) => {
                                                        const product = getProductById(item.product_id);
                                                        return (
                                                            <li key={item.product_id} className="list-group-item">
                                                                {product ? product.name : `Product ID: ${item.product_id}`}: <strong>{item.quantity}</strong>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>🗺️ No deliveries scheduled for today.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryPersonDashboard;
