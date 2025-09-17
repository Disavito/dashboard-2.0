import React from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, DollarSign, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión', { description: error.message });
    } else {
      toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente.' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans p-6">
      <header className="relative h-64 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg mb-8">
        <img
          src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Dashboard background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
            Bienvenido a FinDash
          </h1>
          <p className="mt-4 text-xl text-white text-opacity-90 max-w-2xl mx-auto">
            Tu plataforma integral para la gestión financiera y de socios.
          </p>
        </div>
      </header>

      <div className="container mx-auto py-10 bg-surface rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-foreground mb-6">Resumen Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-textSecondary">Dashboard</CardTitle>
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-textSecondary">
                Accede a una visión general de tus finanzas y actividad.
              </p>
              <Link to="/" className="mt-4 block">
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                  Ir al Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-background border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-textSecondary">Socios</CardTitle>
              <Users className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-textSecondary">
                Gestiona la información de todos los socios titulares.
              </p>
              <Link to="/people" className="mt-4 block">
                <Button variant="outline" className="w-full text-secondary border-secondary hover:bg-secondary/10">
                  Ver Socios
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-background border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-textSecondary">Documentos</CardTitle>
              <FileText className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-textSecondary">
                Revisa y gestiona los documentos de cada socio.
              </p>
              <Link to="/documents" className="mt-4 block">
                <Button variant="outline" className="w-full text-accent border-accent hover:bg-accent/10">
                  Ver Documentos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-background border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-textSecondary">Transacciones</CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-textSecondary">
                Registra y consulta todos los movimientos financieros.
              </p>
              <Link to="/transactions" className="mt-4 block">
                <Button variant="outline" className="w-full text-success border-success hover:bg-success/10">
                  Ver Transacciones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          {user ? (
            <Button
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </Button>
          ) : (
            <p className="text-textSecondary">Por favor, inicia sesión para acceder a todas las funcionalidades.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
