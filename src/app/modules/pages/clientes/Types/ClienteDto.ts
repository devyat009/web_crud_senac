export interface ClienteDto {
  id_client?: string;
  nome: string;
  cpf: string;
  cnpj: string;
  email: string;
  endereco: string;
  telefone: string;
  data_nascimento: string;
  perfil: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}
