import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { SocioTitularWithDocuments, SocioDocumento, DocumentType } from '@/lib/types';
import DocumentDisplayRow, { REQUIRED_DOCUMENT_TYPES } from '@/components/custom/DocumentDisplayRow';
import { Loader2, Search, FileText, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function Documents() {
  const [socios, setSocios] = useState<SocioTitularWithDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  // States for locality filter
  const [uniqueLocalities, setUniqueLocalities] = useState<string[]>([]);
  const [selectedLocalidadFilter, setSelectedLocalidadFilter] = useState<string>('all'); // 'all' for no filter
  const [openLocalitiesFilterPopover, setOpenLocalitiesFilterPopover] = useState(false);

  const fetchSociosWithDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch socio_titulares
    const { data: sociosData, error: sociosError } = await supabase
      .from('socio_titulares')
      .select('*')
      .order('apellidoPaterno', { ascending: true });

    if (sociosError) {
      console.error('Error fetching socios:', sociosError.message);
      setError('Error al cargar los socios. Por favor, inténtalo de nuevo.');
      setSocios([]);
      toast.error('Error al cargar socios', { description: sociosError.message });
      setLoading(false);
      return;
    }

    // 2. Fetch socio_documentos
    const { data: documentosData, error: documentosError } = await supabase
      .from('socio_documentos')
      .select('*');

    if (documentosError) {
      console.error('Error fetching socio_documentos:', documentosError.message);
      toast.warning('No se pudieron cargar los documentos de los socios.', { description: documentosError.message });
    }

    // 3. Group documents by socio_id
    const socioIdToDocumentsMap = new Map<string, SocioDocumento[]>();
    if (documentosData) {
      for (const doc of documentosData) {
        if (!socioIdToDocumentsMap.has(doc.socio_id)) {
          socioIdToDocumentsMap.set(doc.socio_id, []);
        }
        socioIdToDocumentsMap.get(doc.socio_id)?.push(doc);
      }
    }

    // 4. Merge all data into SocioTitularWithDocuments
    const sociosWithAllData: SocioTitularWithDocuments[] = sociosData.map(socio => {
      const documents = socioIdToDocumentsMap.get(socio.id) || [];
      const existingDocumentTypes = new Set(documents.map(d => d.tipo_documento));
      const missingDocumentTypes = REQUIRED_DOCUMENT_TYPES.filter(
        type => !existingDocumentTypes.has(type)
      );

      return {
        ...socio,
        latestReceiptNumber: null, // Not needed in this view, but part of the type
        documents,
        missingDocumentTypes,
      };
    });

    setSocios(sociosWithAllData);
    setError(null);
    setLoading(false);
  }, []);

  // Fetch unique localities for the filter dropdown
  const fetchUniqueLocalities = useCallback(async () => {
    const { data, error } = await supabase
      .from('socio_titulares')
      .select('localidad')
      .neq('localidad', '') // Exclude empty strings
      .order('localidad', { ascending: true });

    if (error) {
      console.error('Error fetching unique localities for filter:', error.message);
      toast.error('Error al cargar localidades para el filtro', { description: error.message });
    } else if (data) {
      const unique = Array.from(new Set(data.map(item => item.localidad))).filter(Boolean) as string[];
      setUniqueLocalities(['Todas las Comunidades', ...unique]); // Add 'All' option
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      try {
        await fetchSociosWithDocuments();
        await fetchUniqueLocalities();
      } catch (e: any) {
        console.error("Unhandled error during initial data fetch in Documents component:", e);
        setError(`Error crítico al cargar datos: ${e.message || 'Desconocido'}. Por favor, revisa tu conexión a Supabase y las variables de entorno.`);
        setLoading(false);
      }
    };
    initFetch();
  }, [fetchSociosWithDocuments, fetchUniqueLocalities]);

  const filteredSocios = useMemo(() => {
    let currentSocios = socios;

    // Apply locality filter
    if (selectedLocalidadFilter !== 'all') {
      currentSocios = currentSocios.filter(socio =>
        socio.localidad?.toLowerCase() === selectedLocalidadFilter.toLowerCase()
      );
    }

    // Apply global text filter
    if (globalFilter) {
      const search = globalFilter.toLowerCase();
      currentSocios = currentSocios.filter(socio =>
        socio.dni?.toLowerCase().includes(search) ||
        socio.nombres?.toLowerCase().includes(search) ||
        socio.apellidoPaterno?.toLowerCase().includes(search) ||
        socio.apellidoMaterno?.toLowerCase().includes(search) ||
        socio.localidad?.toLowerCase().includes(search)
      );
    }

    return currentSocios;
  }, [socios, selectedLocalidadFilter, globalFilter]);


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
          src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Document management"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
            Gestión de Documentos de Socios
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white text-opacity-90 max-w-2xl mx-auto">
            Visualiza y gestiona los documentos requeridos para cada socio.
          </p>
        </div>
      </header>

      <div className="container mx-auto py-10 bg-surface rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative flex items-center w-full max-w-md">
            <Search className="absolute left-3 h-5 w-5 text-textSecondary" />
            <Input
              placeholder="Buscar por DNI, nombre, apellido o localidad..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-border bg-background text-foreground focus:ring-primary focus:border-primary transition-all duration-300 w-full"
            />
          </div>

          {/* Locality Filter */}
          <Popover open={openLocalitiesFilterPopover} onOpenChange={setOpenLocalitiesFilterPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLocalitiesFilterPopover}
                className="w-full md:w-[200px] justify-between rounded-lg border-border bg-background text-foreground hover:bg-muted/50 transition-all duration-300"
              >
                {selectedLocalidadFilter === 'all'
                  ? "Todas las Comunidades"
                  : uniqueLocalities.find(loc => loc.toLowerCase() === selectedLocalidadFilter.toLowerCase()) || selectedLocalidadFilter}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-card border-border rounded-xl shadow-lg">
              <Command>
                <CommandInput placeholder="Buscar comunidad..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontró comunidad.</CommandEmpty>
                  <CommandGroup>
                    {uniqueLocalities.map((loc) => (
                      <CommandItem
                        value={loc}
                        key={loc}
                        onSelect={(currentValue) => {
                          setSelectedLocalidadFilter(currentValue === 'Todas las Comunidades' ? 'all' : currentValue);
                          setOpenLocalitiesFilterPopover(false);
                        }}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLocalidadFilter === (loc === 'Todas las Comunidades' ? 'all' : loc) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {loc}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSocios.length > 0 ? (
            filteredSocios.map((socio) => (
              <Card key={socio.id} className="bg-background border-border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">
                    {socio.nombres} {socio.apellidoPaterno} {socio.apellidoMaterno}
                  </CardTitle>
                  <Badge
                    className={cn(
                      "text-sm font-medium",
                      socio.missingDocumentTypes.length > 0
                        ? "bg-error/20 text-error-foreground"
                        : "bg-success/20 text-success-foreground"
                    )}
                  >
                    {socio.missingDocumentTypes.length > 0
                      ? `${socio.missingDocumentTypes.length} Doc(s) Faltante(s)`
                      : 'Documentos Completos'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-textSecondary text-sm">
                    <p><strong className="text-text">DNI:</strong> {socio.dni}</p>
                    <p><strong className="text-text">Fecha Nacimiento:</strong> {socio.fechaNacimiento}</p>
                    <p><strong className="text-text">Celular:</strong> {socio.celular || 'N/A'}</p>
                    <p><strong className="text-text">Localidad:</strong> {socio.localidad || 'N/A'}</p>
                    <p><strong className="text-text">Situación Económica:</strong> {socio.situacionEconomica}</p>
                  </div>
                  <DocumentDisplayRow
                    socioId={socio.id}
                    documents={socio.documents}
                    missingDocumentTypes={socio.missingDocumentTypes}
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-textSecondary text-lg py-8">
              No se encontraron socios con los criterios de búsqueda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
