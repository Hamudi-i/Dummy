export interface AuthState {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe?: boolean;
}

export type ActiveModal = 'none' | 'forgot_password' | 'signup' | 'docs' | 'team' | 'search';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'alert';
}
