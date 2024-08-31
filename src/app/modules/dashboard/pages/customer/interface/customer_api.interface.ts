


export interface CustomerApi {
  id: number;
  type_document: string | null;
  email: string;
  document: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  date_of_birth: string; // Se podría usar Date si prefieres manipular fechas en formato Date
  profile_image_url: string;
  created_at: string; // También podría ser Date
  user_id: number | null;
  document_type: number | null;
}
