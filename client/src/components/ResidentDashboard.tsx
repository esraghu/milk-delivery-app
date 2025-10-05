import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

// Define interfaces for our data structures
interface SubscriptionItem {
    product_id: number;
    quantity: number;
}

interface Subscription {
    id: number;
    user_id: number;
    items: SubscriptionItem[];
    frequency: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    house_number: string;
    address?: string;
    role: string;
}

interface ResidentDashboardProps {
    user: User;
}

const ResidentDashboard: React.FC<ResidentDashboardProps> = ({ user }) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editItems, setEditItems] = useState<SubscriptionItem[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [vacations, setVacations] = useState<any[]>([]);
    const [cancellations, setCancellations] = useState<any[]>([]);

    const userId = user.id;

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch products
            const productsRes = await axios.get<Product[]>('/products');
            setProducts(productsRes.data);

            // Fetch subscription
            try {
                const subscriptionRes = await axios.get<Subscription>(`/users/${userId}/subscription`);
                setSubscription(subscriptionRes.data);
                setEditItems(subscriptionRes.data.items);
            } catch (subscriptionError) {
                if (axios.isAxiosError(subscriptionError) && subscriptionError.response?.status === 404) {
                    setSubscription(null);
                    setEditItems([]);
                }
            }

            // Fetch orders
            try {
                const ordersRes = await axios.get(`/users/${userId}/orders`);
                setOrders(ordersRes.data);
            } catch (ordersError) {
                console.error("Error fetching orders", ordersError);
                setOrders([]);
            }

            // Fetch vacations
            try {
                const vacationsRes = await axios.get(`/users/${userId}/vacations`);
                setVacations(vacationsRes.data);
            } catch (vacationsError) {
                console.error("Error fetching vacations", vacationsError);
                setVacations([]);
            }

            // Fetch cancellations
            try {
                const cancellationsRes = await axios.get(`/users/${userId}/cancellations`);
                setCancellations(cancellationsRes.data);
            } catch (cancellationsError) {
                console.error("Error fetching cancellations", cancellationsError);
                setCancellations([]);
            }

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleItemChange = (productId: number, quantity: string) => {
        const numQuantity = parseInt(quantity, 10) || 0;
        const existingItem = editItems.find(item => item.product_id === productId);

        if (existingItem) {
            // Update quantity or remove if quantity is 0
            const updatedItems = numQuantity > 0
                ? editItems.map(item => item.product_id === productId ? { ...item, quantity: numQuantity } : item)
                : editItems.filter(item => item.product_id !== productId);
            setEditItems(updatedItems);
        } else if (numQuantity > 0) {
            // Add new item
            setEditItems([...editItems, { product_id: productId, quantity: numQuantity }]);
        }
    };

    const handleSubscriptionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const subscriptionData = {
                items: editItems,
                frequency: 'daily',
            };
            await axios.post(`/users/${userId}/subscription`, subscriptionData);
            alert('Subscription updated successfully!');
            fetchDashboardData();
        } catch (error) {
            console.error("Error updating subscription", error);
            alert('Failed to update subscription.');
        }
    };

    const handleVacationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const vacationData = {
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string
        };
        
        try {
            await axios.post(`/users/${userId}/vacations`, vacationData);
            alert('Vacation period added successfully!');
            fetchDashboardData();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Error adding vacation", error);
            alert('Failed to add vacation period.');
        }
    };

    const handleAdhocOrderSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const items = products
            .map(product => ({
                product_id: product.id,
                quantity: parseInt(formData.get(`adhoc_${product.id}`) as string) || 0
            }))
            .filter(item => item.quantity > 0);

        if (items.length === 0) {
            alert('Please add at least one item to your order.');
            return;
        }

        const orderData = {
            date: formData.get('order_date') as string,
            items,
            is_adhoc: true
        };
        
        try {
            await axios.post(`/users/${userId}/orders`, orderData);
            alert('Ad-hoc order placed successfully!');
            fetchDashboardData();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Error placing order", error);
            alert('Failed to place order.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Welcome, {user.name}!</h3>
                            <p className="mb-0">House: {user.house_number} | Email: {user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Subscription Management */}
                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h4>🥛 My Daily Farm Delivery</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubscriptionSubmit}>
                                {products.map(product => {
                                    const currentItem = editItems.find(item => item.product_id === product.id);
                                    return (
                                        <div className="mb-3 row" key={product.id}>
                                            <label htmlFor={`product-${product.id}`} className="col-sm-4 col-form-label">
                                                {product.name} (₹{product.price})
                                            </label>
                                            <div className="col-sm-8">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`product-${product.id}`}
                                                    min="0"
                                                    value={currentItem?.quantity || 0}
                                                    onChange={(e) => handleItemChange(product.id, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button type="submit" className="btn btn-primary">🐄 Update Farm Delivery</button>
                            </form>
                        </div>
                        <div className="card-footer">
                            <h6>🌾 Current Farm Delivery Plan</h6>
                            {subscription && subscription.items.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {subscription.items.map((item: any) => {
                                        const product = products.find(p => p.id === item.product_id);
                                        return (
                                            <li key={item.product_id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                                {product ? product.name : 'Unknown Product'}
                                                <span className="badge bg-primary rounded-pill">{item.quantity}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <small className="text-muted">🐄 No active farm delivery plan</small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ad-hoc Orders */}
                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h4>🥛 Special Farm Order</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAdhocOrderSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="order_date" className="form-label">📅 Farm Delivery Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="order_date"
                                        name="order_date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {products.map(product => (
                                    <div className="mb-3 row" key={product.id}>
                                        <label htmlFor={`adhoc_${product.id}`} className="col-sm-4 col-form-label">
                                            {product.name} (₹{product.price})
                                        </label>
                                        <div className="col-sm-8">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`adhoc_${product.id}`}
                                                name={`adhoc_${product.id}`}
                                                min="0"
                                                defaultValue="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button type="submit" className="btn btn-success">🍾 Order Fresh from Farm</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Vacation Management */}
                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h4>🏡 Away from the Farmhouse</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleVacationSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="start_date" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="start_date"
                                        name="start_date"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="end_date" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="end_date"
                                        name="end_date"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-warning">✈️ Add Away Period</button>
                            </form>
                            
                            {vacations.length > 0 && (
                                <div className="mt-3">
                                    <h6>🌴 Upcoming Away Periods</h6>
                                    <ul className="list-group list-group-flush">
                                        {vacations.map((vacation: any) => (
                                            <li key={vacation.id} className="list-group-item p-2">
                                                {vacation.start_date} to {vacation.end_date}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders History */}
                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h4>📜 Farm Delivery History</h4>
                        </div>
                        <div className="card-body">
                            {orders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Items</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order: any) => (
                                                <tr key={order.id}>
                                                    <td>{order.date}</td>
                                                    <td>
                                                        <span className={`badge ${order.is_adhoc ? 'bg-info' : 'bg-primary'}`}>
                                                            {order.is_adhoc ? '🍾 Special' : '🐄 Daily'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${order.status === 'delivered' ? 'bg-success' : 
                                                            order.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>{order.items ? order.items.length : 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">🍾 No farm deliveries yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellations */}
            {cancellations.length > 0 && (
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h4>Cancellation History</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cancellations.map((cancellation: any) => (
                                                <tr key={cancellation.id}>
                                                    <td>{new Date(cancellation.cancelled_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {cancellation.cancellation_type}
                                                        </span>
                                                    </td>
                                                    <td>{cancellation.reason || 'No reason provided'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResidentDashboard;
