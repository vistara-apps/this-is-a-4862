import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { Profile } from './pages/Profile';
import { Subscription } from './pages/Subscription';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { MarketDataProvider } from './context/MarketDataContext';
import { useAuth } from './context/AuthContext';
import { Loader } from './components/Loader';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Main layout component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-bg text-dark-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Login page component
const Login: React.FC = () => {
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget as HTMLFormElement).email.value;
    const password = (e.currentTarget as HTMLFormElement).password.value;
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark-text-primary">LeverageCalc Pro</h1>
          <p className="text-dark-text-secondary mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-dark-border text-dark-accent focus:ring-dark-accent"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-text-secondary">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-dark-accent hover:text-dark-accent/90">
                Forgot password?
              </a>
            </div>
          </div>
          
          <div>
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-dark-text-secondary">
            Don't have an account?{' '}
            <a href="#" className="text-dark-accent hover:text-dark-accent/90">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Register page component
const Register: React.FC = () => {
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget as HTMLFormElement).email.value;
    const password = (e.currentTarget as HTMLFormElement).password.value;
    await signUp(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark-text-primary">LeverageCalc Pro</h1>
          <p className="text-dark-text-secondary mt-2">Create your account</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-dark-border text-dark-accent focus:ring-dark-accent"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-dark-text-secondary">
              I agree to the{' '}
              <a href="#" className="text-dark-accent hover:text-dark-accent/90">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-dark-accent hover:text-dark-accent/90">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <div>
            <button type="submit" className="btn-primary w-full">
              Create Account
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-dark-text-secondary">
            Already have an account?{' '}
            <a href="#" className="text-dark-accent hover:text-dark-accent/90">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <MarketDataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="p-6">
                      <Dashboard />
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/calculator" element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="p-6">
                      <Calculator />
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Subscription />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </MarketDataProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;

