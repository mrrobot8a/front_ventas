export interface ProductApi {
  id_product: number;
  supplier_name: string;
  supplier_nit: string;
  name: string;
  category: string;
  brand: string;
  unit_price: string;  // Si prefieres trabajar con números, puedes cambiarlo a `number`
  stock_units: number;
  description: string;
  id_supplier: number;
}
