export interface SignUpModel {
  name: string;
  email: string;
  createPassword: string;
  confirmPassword: string;
}

export interface RegisterWithGoogleModel {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
  state: string;
}

export interface LoginModel {
  name: string;
  email: string;
}

export interface LoginWithGoogleModel {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
  state: string;
}

export interface CurrentUserModel {
  authProvider: number;
  isEmailVerified: boolean;
  id: number;
  email: string;
  isActive: boolean;
  joinedOn: string;
  name: string;
}
