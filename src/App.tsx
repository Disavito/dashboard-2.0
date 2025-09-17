import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import People from './pages/People';
import Collaborators from './pages/Collaborators';
import Documents from './pages/Documents';
import Income from './pages/Income'; // Import the Income page
import Expenses from './pages/Expenses'; // Import the Expenses page
import ProtectedRoute from './components/ui-custom/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { useUser } from './context/UserContext';
import Sidebar from './components/ui-custom/Sidebar';
import Header from './components/ui-custom/Header';

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {user && <Header />}
        <main className="flex-1">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/people"
              element={
                <ProtectedRoute>
                  <People />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collaborators"
              element={
                <ProtectedRoute>
                  <Collaborators />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income" // New route for Income page
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses" // New route for Expenses page
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default App;
