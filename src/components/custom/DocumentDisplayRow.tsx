import { SocioTitularWithDocuments, DocumentType, SocioDocumento } from '@/lib/types';
import { CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


// FIX: Removed unused imports: UploadCloud, Button

interface DocumentDisplayRowProps {
  socio: SocioTitularWithDocuments;
}

const requiredDocs: DocumentType[] = [
  'DNI',
  'Ficha',
  'Contrato',
  'Planos de ubicación',
  'Memoria descriptiva',
];

// FIX: Removed unused 'socioId' from props destructuring
export default function DocumentDisplayRow({ socio }: DocumentDisplayRowProps) {
  
  const findDocument = (type: DocumentType): SocioDocumento | undefined => {
    // FIX: Correctly handle argument type by ensuring 'type' is of DocumentType
    return socio.socio_documentos.find(doc => doc.tipo_documento === type);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requiredDocs.map((docType) => {
          const doc = findDocument(docType);
          return (
            <div key={docType} className="border rounded-lg p-4 flex flex-col justify-between bg-surface">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{docType}</h4>
                  {doc ? (
                    <a href={doc.link_documento} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Badge variant="destructive">Faltante</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-textSecondary">
                  {/* FIX: Properties 'subido_manual', 'impreso', 'confirmado' now exist on the augmented type */}
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1">
                        {doc?.subido_manual ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-error" />}
                        Manual
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Subido Manualmente</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1">
                        {doc?.impreso ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-error" />}
                        Impreso
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Documento Impreso</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1">
                        {doc?.confirmado ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Clock className="h-4 w-4 text-warning" />}
                        Confirmado
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Confirmado por Admin</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
