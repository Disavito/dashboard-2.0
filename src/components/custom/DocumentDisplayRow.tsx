import React from 'react';
import { SocioDocumento, DocumentType } from '@/lib/types';
import { CheckCircle, XCircle, Link, UploadCloud, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DocumentDisplayRowProps {
  socioId: string;
  documents: SocioDocumento[];
  missingDocumentTypes: DocumentType[];
  // onUploadDocument?: (socioId: string, documentType: DocumentType) => void; // Placeholder for future upload functionality
}

// Define los tipos de documentos requeridos según la tabla `socio_documentos`
// Actualizado para incluir solo los 4 tipos especificados por el usuario
export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  'Ficha',
  'Contrato',
  'Planos de ubicación', // Asumiendo que "Planos" se refiere a "Planos de ubicación"
  'Memoria descriptiva',
];

const DocumentDisplayRow: React.FC<DocumentDisplayRowProps> = ({
  socioId,
  documents,
  missingDocumentTypes,
  // onUploadDocument, // Uncomment when upload functionality is ready
}) => {
  const documentMap = new Map<DocumentType, SocioDocumento>();
  documents.forEach(doc => documentMap.set(doc.tipo_documento, doc));

  return (
    <div className="p-4 bg-surface/50 rounded-lg mt-2 border border-border">
      <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" /> Documentos del Socio
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REQUIRED_DOCUMENT_TYPES.map((type) => {
          const doc = documentMap.get(type);
          const isMissing = missingDocumentTypes.includes(type);

          return (
            <Card key={type} className={cn(
              "bg-background border transition-all duration-300",
              isMissing ? "border-error/50 shadow-md shadow-error/10" : "border-border hover:shadow-lg hover:shadow-primary/10"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-textSecondary">{type}</CardTitle>
                {isMissing ? (
                  <XCircle className="h-5 w-5 text-error" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
              </CardHeader>
              <CardContent>
                {doc ? (
                  <div className="space-y-2">
                    {doc.link_documento ? (
                      <a
                        href={doc.link_documento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline text-sm font-medium transition-colors duration-200"
                      >
                        <Link className="h-4 w-4 mr-2" /> Ver Documento
                      </a>
                    ) : (
                      <p className="text-sm text-textSecondary italic">Link no disponible</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {doc.subido_manual && <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">Subido Manual</Badge>}
                      {doc.impreso && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Impreso</Badge>}
                      {doc.confirmado && <Badge variant="success" className="bg-success/20 text-success-foreground">Confirmado</Badge>}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm text-error font-medium">Documento Faltante</p>
                    {/* Uncomment when upload functionality is ready */}
                    {/* {onUploadDocument && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary hover:bg-primary/10"
                        onClick={() => onUploadDocument(socioId, type)}
                      >
                        <UploadCloud className="h-4 w-4 mr-2" /> Subir
                      </Button>
                    )} */}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Separator className="my-6 bg-border" />
      <p className="text-sm text-textSecondary italic text-center">
        Esta sección muestra el estado de los documentos requeridos para este socio.
      </p>
    </div>
  );
};

export default DocumentDisplayRow;
