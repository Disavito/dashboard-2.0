// Elimina estas importaciones no utilizadas
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ... dentro de la definición de tu componente ...

// Elimina este prop no utilizado de la desestructuración
const { document, socioId, onDelete } = props; // Cambia esto
// a:
const { document, onDelete } = props;
