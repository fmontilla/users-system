import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi, publicApi, CreateUserDto, UpdateUserDto } from '@/lib/api';

export function useUsers(usePublicApi = false) {
  return useQuery({
    queryKey: ['users'],
    queryFn: usePublicApi ? publicApi.getUsers : userApi.getAll,
  });
}

export function useUser(id: number, usePublicApi = false) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usePublicApi ? publicApi.getUser(id) : userApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      userApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
} 