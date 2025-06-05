'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useUpdateUser } from '@/hooks/use-users';

interface EditUserProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUser({ params }: EditUserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const { data: user, isLoading, error } = useUser(userId || 0);
  const updateUser = useUpdateUser();

  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(parseInt(resolvedParams.id));
    });
  }, [params]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: userId,
        data: { name: name.trim(), email: email.trim() },
      });
      alert('User updated successfully!');
      router.push('/');
    } catch (error) {
      alert('Error updating user');
      console.error(error);
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading user...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to list
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Usuário #{userId}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the user's name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the user's email"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updateUser.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 