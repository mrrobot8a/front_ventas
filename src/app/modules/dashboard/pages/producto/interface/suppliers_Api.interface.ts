export interface SupplierApi {
  id_supplier: number;
  name: string;
  nit: string;
  city: string;
  email: string;
  contact_number: string;
  created_at: string; // Podría ser Date si se maneja como tal
  updated_at: string; // Igual que `created_at`, podría ser un Date
}

export type Suppliers = SupplierApi[]; // Tipo para un array de Supplier
