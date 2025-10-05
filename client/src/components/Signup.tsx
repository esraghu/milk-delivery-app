import React, { useState } from 'react';
import axios from 'axios';

interface SignupData {
  name: string;
  email: string;
  house_number: string;
  address: string;
}

interface SignupProps {
  onSignupSuccess: (user: any) => void;
  onCancel: () => void;
  onSwitchToLogin?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onCancel, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupData>({
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
      const response = await axios.post('/signup', formData);
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
            <div className="card-header">
              <h4 className="mb-0">🐄 Join MooFresh Farm Family</h4>
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
                  <label htmlFor="house_number" className="form-label">🏠 Farmhouse Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="house_number"
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleInputChange}
                    placeholder="e.g., A-101, 25B, Farmhouse 12"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Full Address (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, city, etc."
                  />
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '🐄 Joining the farm...' : '🌾 Join Our Farm'}
                  </button>
                  
                  {onSwitchToLogin && (
                    <div className="text-center">
                      <small className="text-muted">
                        Already part of our farm family?{' '}
                        <button 
                          type="button" 
                          className="btn btn-link p-0 text-decoration-underline"
                          onClick={onSwitchToLogin}
                          disabled={loading}
                        >
                          🌾 Enter the farm
                        </button>
                      </small>
                    </div>
                  )}
                  
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

export default Signup;
