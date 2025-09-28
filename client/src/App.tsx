import React, { useState, useEffect } from 'react';
import ResidentDashboard from './components/ResidentDashboard';
import DeliveryPersonDashboard from './components/DeliveryPersonDashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import DeliverySignup from './components/DeliverySignup';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  house_number: string;
  address?: string;
  role: string;
}

type ViewState = 'home' | 'login' | 'signup' | 'delivery-signup';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [userRole, setUserRole] = useState('resident'); // for demo purposes

  // Session management
  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('dailydoodh_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('dailydoodh_user');
      }
    }
  }, []);

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    setCurrentView('home');
    localStorage.setItem('dailydoodh_user', JSON.stringify(newUser));
  };

  const handleSignupSuccess = (newUser: User) => {
    setUser(newUser);
    setCurrentView('home');
    localStorage.setItem('dailydoodh_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    localStorage.removeItem('dailydoodh_user');
  };

  const resetToHome = () => {
    setCurrentView('home');
  };

  // Render different views
  if (currentView === 'login') {
    return (
      <div className="App-container">
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onCancel={resetToHome}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      </div>
    );
  }

  if (currentView === 'signup') {
    return (
      <div className="App-container">
        <Signup 
          onSignupSuccess={handleSignupSuccess} 
          onCancel={resetToHome}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      </div>
    );
  }

  if (currentView === 'delivery-signup') {
    return (
      <div className="App-container">
        <DeliverySignup 
          onSignupSuccess={handleSignupSuccess} 
          onCancel={resetToHome}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">DailyDoodh</a>
          <div className="navbar-nav ms-auto d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">
                  Welcome, {user.name} ({user.role === 'delivery_person' ? user.house_number : 'House: ' + user.house_number})
                </span>
                {user.role === 'resident' && (
                  <>
                    <button className="btn btn-outline-light me-2" onClick={() => setUserRole('resident')}>
                      My Dashboard
                    </button>
                    <button className="btn btn-outline-light me-2" onClick={() => setUserRole('delivery_person')}>
                      Delivery View
                    </button>
                  </>
                )}
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-light me-2" onClick={() => setCurrentView('login')}>
                  Login
                </button>
                <div className="btn-group" role="group">
                  <button 
                    className="btn btn-primary dropdown-toggle" 
                    type="button" 
                    id="signupDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Sign Up
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="signupDropdown">
                    <li>
                      <button className="dropdown-item" onClick={() => setCurrentView('signup')}>
                        As Customer
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => setCurrentView('delivery-signup')}>
                        As Delivery Person
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        {user ? (
          user.role === 'delivery_person' ? 
            <DeliveryPersonDashboard user={user} /> :
            (userRole === 'resident' ? 
              <ResidentDashboard user={user} /> : 
              <DeliveryPersonDashboard user={user} />)
        ) : (
          <div className="text-center">
            <h1>Welcome to DailyDoodh</h1>
            <p className="lead">Your daily dairy delivery service</p>
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">For Customers</h5>
                    <p className="card-text">Manage your daily milk and dairy subscriptions</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary" onClick={() => setCurrentView('login')}>
                        Login
                      </button>
                      <button className="btn btn-outline-primary" onClick={() => setCurrentView('signup')}>
                        Sign Up as Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">For Delivery Partners</h5>
                    <p className="card-text">Join our delivery network and manage routes</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-success" onClick={() => setCurrentView('delivery-signup')}>
                        Join as Delivery Person
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
