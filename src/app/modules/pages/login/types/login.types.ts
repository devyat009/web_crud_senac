export interface LoginRequestDto {
  email: string;
  password: string;
}

// TODO
export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
  };
  expiresIn: number;
}

export interface CreateAccountRequestDto {
  email: string;
  password: string;
  confirm_password: string;
  cpf: string;
  cnpj?: string;
  nome: string;
  telefone: string;
  data_nascimento: string;
}

export interface CreateAccountResponseDto {
  id: string;
  email: string;
  nome: string;
  message: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
  cpf: string;
  data_nascimento: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
  resetToken?: string;
}

export interface ApiErrorDto {
  message: string;
  statusCode: number;
  errors?: string[];
}
