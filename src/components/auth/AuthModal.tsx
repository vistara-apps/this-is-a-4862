import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthView = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'login',
}) => {
  const [view, setView] = useState<AuthView>(defaultView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md">
        <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text-primary"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <div className="p-6">
            {view === 'login' ? (
              <LoginForm
                onSuccess={onClose}
                onRegisterClick={() => setView('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={() => {
                  setView('login');
                  // Don't close the modal after registration, show login instead
                }}
                onLoginClick={() => setView('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

