import { Tables } from './database.types';

export type Cuenta = Tables<'cuentas'>;
export type Ingreso = Tables<'ingresos'>;
export type Gasto = Tables<'gastos'>;
export type Colaborador = Tables<'colaboradores'>;
export type SocioTitular = Tables<'socio_titulares'>;

// FIX: Expanded DocumentType to include all required document names.
export type DocumentType = 
  | 'DNI' 
  | 'Acta de Constitución' 
  | 'Vigencia de Poder' 
  | 'Ficha'
  | 'Contrato'
  | 'Planos de ubicación'
  | 'Memoria descriptiva'
  | 'Otros';

// FIX: Augmented the base SocioDocumento type to include missing boolean fields.
export type SocioDocumento = Tables<'socio_documentos'> & {
  subido_manual?: boolean;
  impreso?: boolean;
  confirmado?: boolean;
};

// FIX: Added and exported the missing composite type for partners with their documents.
export type SocioTitularWithDocuments = SocioTitular & {
  socio_documentos: SocioDocumento[];
};

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
