import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Display from './pages/Display';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Display />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StoreProvider>
  );
}
