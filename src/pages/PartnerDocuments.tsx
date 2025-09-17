import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Loader2, Link as LinkIcon, FolderSearch, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Define the structure of a document and a partner with their documents
interface SocioDocumento {
  id: number;
  tipo_documento: string;
  link_documento: string;
}

interface IngresoInfo {
  status: 'Pagado' | 'No Pagado';
  receipt_number: string | null;
}

interface SocioConDocumentos {
  id: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  localidad: string;
  socio_documentos: SocioDocumento[];
  paymentInfo: IngresoInfo;
}

function PartnerDocuments() {
  const [sociosConDocumentos, setSociosConDocumentos] = useState<SocioConDocumentos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocalidad, setSelectedLocalidad] = useState('all');
  const [localidades, setLocalidades] = useState<string[]>([]);

  const allowedDocumentTypes = useMemo(() => [
    "Planos de ubicación",
    "Memoria descriptiva",
    "Ficha",
    "Contrato"
  ], []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch partners, documents, localities, and income records concurrently
      const [sociosRes, localidadesRes, ingresosRes] = await Promise.all([
        supabase
          .from('socio_titulares')
          .select(`
            id, dni, nombres, apellidoPaterno, apellidoMaterno, localidad,
            socio_documentos (id, tipo_documento, link_documento)
          `)
          .order('apellidoPaterno', { ascending: true }),
        supabase.from('socio_titulares').select('localidad').neq('localidad', null),
        supabase.from('ingresos').select('dni, receipt_number').neq('dni', null)
      ]);

      if (sociosRes.error) throw sociosRes.error;
      if (localidadesRes.error) throw localidadesRes.error;
      if (ingresosRes.error) throw ingresosRes.error;

      // Process localities
      const uniqueLocalidades = [...new Set(localidadesRes.data.map(item => item.localidad).filter(Boolean) as string[])];
      setLocalidades(uniqueLocalidades.sort());

      // Process income data into a lookup map for quick access
      const ingresosMap = new Map<string, { receipt_number: string | null }>();
      ingresosRes.data.forEach(ingreso => {
        if (ingreso.dni) {
          ingresosMap.set(ingreso.dni, { receipt_number: ingreso.receipt_number });
        }
      });

      // Process and merge partner data with payment info
      const processedData = sociosRes.data.map(socio => {
        const paymentRecord = ingresosMap.get(socio.dni);
        const paymentInfo: IngresoInfo = {
          status: paymentRecord ? 'Pagado' : 'No Pagado',
          receipt_number: paymentRecord?.receipt_number || null,
        };

        return {
          ...socio,
          socio_documentos: socio.socio_documentos.filter(doc =>
            allowedDocumentTypes.includes(doc.tipo_documento)
          ),
          paymentInfo,
        };
      });

      setSociosConDocumentos(processedData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      setError('Error al cargar los datos. Por favor, revisa la consola para más detalles.');
      toast.error('Error al cargar datos', { description: error.message });
      setSociosConDocumentos([]);
    } finally {
      setLoading(false);
    }
  }, [allowedDocumentTypes]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredData = useMemo(() => {
    return sociosConDocumentos.filter(socio => {
      const searchLower = searchQuery.toLowerCase().trim();
      
      // Safely construct the full name and get DNI, handling potential null values
      const fullName = (`${socio.nombres || ''} ${socio.apellidoPaterno || ''} ${socio.apellidoMaterno || ''}`).toLowerCase().trim();
      const dni = (socio.dni || '').toLowerCase();

      const matchesLocalidad = selectedLocalidad === 'all' || socio.localidad === selectedLocalidad;
      
      // If no search query, only filter by locality
      if (!searchLower) {
        return matchesLocalidad;
      }

      // Split search query into individual terms
      const searchTerms = searchLower.split(' ').filter(term => term.length > 0);

      // Check if DNI contains the full search query (for partial DNI search)
      const matchesDni = dni.includes(searchLower);

      // Check if the full name contains ALL of the search terms
      const matchesName = searchTerms.every(term => fullName.includes(term));

      return matchesLocalidad && (matchesDni || matchesName);
    });
  }, [sociosConDocumentos, searchQuery, selectedLocalidad]);

  const columns: ColumnDef<SocioConDocumentos>[] = useMemo(
    () => [
      {
        accessorKey: 'nombreCompleto',
        header: 'Nombre Completo',
        cell: ({ row }) => {
          const socio = row.original;
          const fullName = `${socio.nombres || ''} ${socio.apellidoPaterno || ''} ${socio.apellidoMaterno || ''}`.trim();
          return <div className="font-medium text-text">{fullName || 'N/A'}</div>;
        },
      },
      {
        accessorKey: 'dni',
        header: 'DNI',
        cell: ({ row }) => <div className="text-textSecondary">{row.getValue('dni') || 'N/A'}</div>,
      },
      {
        accessorKey: 'paymentInfo.status',
        header: 'Estado de Pago',
        cell: ({ row }) => {
          const { status } = row.original.paymentInfo;
          return (
            <Badge variant={status === 'Pagado' ? 'success' : 'destructive'}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'paymentInfo.receipt_number',
        header: 'N° Recibo',
        cell: ({ row }) => row.original.paymentInfo.receipt_number || <span className="text-textSecondary/70 italic">N/A</span>,
      },
      {
        id: 'documentos',
        header: 'Documentos',
        cell: ({ row }) => {
          const { socio_documentos } = row.original;
          if (!socio_documentos || socio_documentos.length === 0) {
            return <span className="text-textSecondary/70 italic text-sm">Sin documentos</span>;
          }
          return (
            <div className="flex flex-col space-y-2 items-start">
              {socio_documentos.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.link_documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-200 text-sm font-medium group"
                >
                  <LinkIcon className="h-4 w-4 text-secondary group-hover:animate-pulse" />
                  <span>{doc.tipo_documento}</span>
                </a>
              ))}
            </div>
          );
        },
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text font-sans flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Cargando documentos de socios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text font-sans flex items-center justify-center">
        <p className="text-destructive text-lg text-center p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text font-sans p-6">
      <header className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent to-primary rounded-xl shadow-lg mb-8">
        <img
          src="https://images.pexels.com/photos/1181352/pexels-photo-1181352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Document organization"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
            Documentos de Socios
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white text-opacity-90 max-w-2xl mx-auto">
            Filtra, busca y accede a la documentación clave de cada socio.
          </p>
        </div>
      </header>

      <div className="container mx-auto py-10">
        <Card className="bg-surface rounded-xl shadow-lg border-border">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
              <FolderSearch className="h-7 w-7" />
              Socio y Documentos
            </CardTitle>
            <CardDescription className="text-textSecondary pt-1">
              Tabla de socios con enlaces directos a sus documentos, estado de pago y filtros de búsqueda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
                <Input
                  placeholder="Buscar por DNI, nombre o apellidos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-background border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <Select value={selectedLocalidad} onValueChange={setSelectedLocalidad}>
                <SelectTrigger className="w-full md:w-[220px] bg-background border-border rounded-lg focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Filtrar por localidad" />
                </SelectTrigger>
                <SelectContent className="border-border bg-surface">
                  <SelectItem value="all">Todas las localidades</SelectItem>
                  {localidades.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DataTable columns={columns} data={filteredData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PartnerDocuments;
