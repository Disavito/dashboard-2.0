import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Transactions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text font-sans p-6">
      <header className="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-primary rounded-xl shadow-lg mb-8">
        <img
          src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Transactions background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            Gestión de Transacciones
          </h1>
          <p className="mt-2 text-lg text-white text-opacity-90 max-w-xl mx-auto">
            Visualiza y administra todos los movimientos financieros.
          </p>
        </div>
      </header>

      <div className="container mx-auto py-8 bg-surface rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">Listado de Transacciones</h2>
          <Link to="/">
            <Button variant="outline" className="text-textSecondary border-border hover:bg-background/50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
            </Button>
          </Link>
        </div>

        <Card className="bg-background border-border rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-text">Próximamente: Detalles de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-textSecondary mb-4">
              Aquí podrás ver un listado completo de todas las transacciones, filtrarlas, ordenarlas y ver sus detalles.
              Estamos trabajando para traer esta funcionalidad pronto.
            </p>
            <p className="text-textSecondary">
              Mantente atento a las actualizaciones para una gestión financiera más robusta.
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for future transaction list */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-background border-border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-text">Transacción #{1000 + i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-textSecondary">Tipo: Pago de Cuota</p>
                <p className="text-sm text-textSecondary">Monto: $XXX.XX</p>
                <p className="text-sm text-textSecondary">Fecha: DD/MM/AAAA</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
