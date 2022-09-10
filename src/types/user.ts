export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}
