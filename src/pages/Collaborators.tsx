import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';

const Collaborators: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text font-sans p-6">
      <header className="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent to-secondary rounded-xl shadow-lg mb-8">
        <img
          src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Collaborators background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            Gestión de Colaboradores
          </h1>
          <p className="mt-2 text-lg text-white text-opacity-90 max-w-xl mx-auto">
            Administra los usuarios y sus roles dentro de la plataforma.
          </p>
        </div>
      </header>

      <div className="container mx-auto py-8 bg-surface rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-foreground flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" /> Listado de Colaboradores
          </h2>
          <Link to="/">
            <Button variant="outline" className="text-textSecondary border-border hover:bg-background/50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
            </Button>
          </Link>
        </div>

        <Card className="bg-background border-border rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-text">Próximamente: Administración de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-textSecondary mb-4">
              Aquí podrás añadir, editar y eliminar colaboradores, así como asignarles diferentes permisos y roles.
              Estamos desarrollando esta sección para ofrecerte un control total sobre tu equipo.
            </p>
            <p className="text-textSecondary">
              Mantente atento a las actualizaciones para una gestión de equipo más eficiente.
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for future collaborators list */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-background border-border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-text">Colaborador {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-textSecondary">Nombre: Usuario {i + 1}</p>
                <p className="text-sm text-textSecondary">Rol: Editor</p>
                <p className="text-sm text-textSecondary">Estado: Activo</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
