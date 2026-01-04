import React, { useState, useEffect } from 'react';

interface AdminPinGuardProps {
  children: React.ReactNode;
}

export const AdminPinGuard: React.FC<AdminPinGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Hardcoded PIN for prototype - in production, fetch from secure config or auth service
  const CORRECT_PIN = '1234';

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-500">Enter security PIN to continue</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-4 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < pin.length ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-16 rounded-xl bg-gray-100 text-2xl font-semibold text-gray-700 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-16 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
          >
            CLR
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-16 rounded-xl bg-gray-100 text-2xl font-semibold text-gray-700 hover:bg-blue-50 active:bg-blue-100 transition-colors"
          >
            0
          </button>
          <button
            onClick={() => window.location.reload()} // Simple way to exit back to main app if stuck
            className="h-16 rounded-xl bg-gray-50 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
};
