import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options
              className: '',
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Success options
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              // Error options
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
