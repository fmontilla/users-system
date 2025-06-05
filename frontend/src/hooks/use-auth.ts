import { useMutation } from '@tanstack/react-query';
import { authApi, LoginDto, RegisterDto } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      login(response.user, response.access_token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
  });
}

export { useAuth } from '@/contexts/AuthContext'; 