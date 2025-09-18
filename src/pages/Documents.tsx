import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SocioTitularWithDocuments } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import DocumentDisplayRow from '@/components/custom/DocumentDisplayRow';

// FIX: Removed unused imports: React, DocumentType, FileText, CardDescription

export default function Documents() {
  const [socios, setSocios] = useState<SocioTitularWithDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSociosWithDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('socio_titulares')
        .select(`
          *,
          socio_documentos (
            *
          )
        `);

      if (error) {
        console.error('Error fetching socios:', error);
        setError('No se pudieron cargar los datos de los socios.');
      } else {
        setSocios(data as SocioTitularWithDocuments[]);
      }
      setLoading(false);
    };

    fetchSociosWithDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {socios.map((socio) => (
        <Card key={socio.id}>
          <CardHeader>
            <CardTitle>{socio.nombres} {socio.apellidoPaterno} {socio.apellidoMaterno}</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentDisplayRow socio={socio} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
