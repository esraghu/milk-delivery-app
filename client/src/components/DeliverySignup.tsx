import React, { useState } from 'react';
import axios from 'axios';

interface DeliverySignupData {
  name: string;
  email: string;
  house_number: string;
  address: string;
}

interface DeliverySignupProps {
  onSignupSuccess: (user: any) => void;
  onCancel: () => void;
}

const DeliverySignup: React.FC<DeliverySignupProps> = ({ onSignupSuccess, onCancel }) => {
  const [formData, setFormData] = useState<DeliverySignupData>({
    name: '',
    email: '',
    house_number: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/signup-delivery', formData);
      onSignupSuccess(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">🚚 Join as Delivery Partner</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="house_number" className="form-label">🚚 Vehicle/Partner ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="house_number"
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleInputChange}
                    placeholder="e.g., KA05AB1234, DD001"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Contact Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Your contact address"
                    required
                  />
                </div>

                <div className="alert alert-info">
                  <small>
                    <strong>🚚 Note:</strong> As a delivery partner, you'll collect dairy products from distribution centers and deliver to subscribers on assigned routes.
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? '🚚 Registering...' : '🚚 Become Delivery Partner'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySignup;
