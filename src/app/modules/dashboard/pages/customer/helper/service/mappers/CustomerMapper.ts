import { CustomerModelTable } from "../../../interface/customerModelTable.interface";


export function mapToCustomerModelTable(data: any): CustomerModelTable[] {
  return data.map((item: any) => ({
    id: item.id,
    type_document: item.type_document,
    email: item.email,
    document: item.document,
    fullName: item.first_name + ' ' + item.last_name,
    address: item.address,
    phone: item.phone,
    date_of_birth: item.date_of_birth,
    profile_image_url: item.profile_image_url,
    created_at: item.created_at,
    user_id: item.user_id,
    document_type: item.document_type
  }));
}
