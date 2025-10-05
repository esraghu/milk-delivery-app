import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onCancel: () => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCancel, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/login', { email });
      onLoginSuccess(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('User not found. Please check your email or sign up first.');
      } else {
        setError(err.response?.data?.detail || 'Login failed. Please try again.');
      }
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
              <h4 className="mb-0">🥛 Login to DailyDairy</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="Enter your registered email"
                  />
                  <div className="form-text">
                    Just enter your email - no password required!
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || !email.trim()}
                  >
                    {loading ? '🥛 Logging in...' : '🥛 Login'}
                  </button>
                  
                  <div className="text-center">
                    <small className="text-muted">
                      New subscriber?{' '}
                      <button 
                        type="button" 
                        className="btn btn-link p-0 text-decoration-underline"
                        onClick={onSwitchToSignup}
                        disabled={loading}
                      >
                        🥛 Sign up here
                      </button>
                    </small>
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    🏠 Back to Home
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

export default Login;
