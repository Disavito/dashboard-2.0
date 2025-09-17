import { Tables } from './database.types'; // Removed Database

export type Cuenta = Tables<'cuentas'>;
export type Ingreso = Tables<'ingresos'>;
export type Gasto = Tables<'gastos'>;
export type Colaborador = Tables<'colaboradores'>;

export type SocioTitular = Tables<'socio_titulares'>;
export type SocioDocumento = Tables<'socio_documentos'>; // New type for documents

// Define the union type for document types directly from the database schema
export type DocumentType = SocioDocumento['tipo_documento'];

// Extend SocioTitular for UI purposes to include derived fields
export interface SocioTitularWithReceipt extends SocioTitular {
  latestReceiptNumber?: string | null;
}

// Extend SocioTitularWithReceipt to include documents and missing document types
export interface SocioTitularWithDocuments extends SocioTitularWithReceipt {
  documents: SocioDocumento[];
  missingDocumentTypes: DocumentType[];
}

export type EconomicSituationOption = {
  value: 'Pobre' | 'Extremo Pobre';
  label: string;
};

export type TransactionType = 'Ingreso' | 'Anulacion' | 'Devolucion' | 'Gasto';

// Nuevo tipo para representar una transacción genérica (Ingreso o Gasto)
export type Transaction = Ingreso | Gasto;

export interface TransactionFormValues {
  accountName: string;
  transactionType: TransactionType;
  amount: number;
  date: Date;
  description?: string;
  category?: string;
  sub_category?: string;
  receiptNumber?: string;
  dni?: string;
  fullName?: string;
  numeroOperacion?: string;
  numeroGasto?: string;
  colaboradorId?: string;
}
