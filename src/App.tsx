import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import People from './pages/People';
import Accounts from './pages/Accounts';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Settings from './pages/Settings';
import AuthPage from './pages/Auth';
import AccountDetails from './pages/AccountDetails';
import PartnerDocuments from './pages/PartnerDocuments';
import { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && window.location.pathname !== '/auth') {
        navigate('/auth');
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user && window.location.pathname !== '/auth') {
        navigate('/auth');
      } else if (session?.user && window.location.pathname === '/auth') {
        navigate('/');
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {/*
        CONFIRMACIÓN: El componente ProtectedRoute ha sido eliminado.
        Todas las rutas ahora son accesibles para cualquier usuario autenticado.
        La visibilidad de los datos dentro de cada página se controla mediante
        Row Level Security (RLS) de Supabase, que es un enfoque más seguro y robusto.
      */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="people" element={<People />} />
        <Route path="partner-documents" element={<PartnerDocuments />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/:id" element={<AccountDetails />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="income" element={<Income />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
