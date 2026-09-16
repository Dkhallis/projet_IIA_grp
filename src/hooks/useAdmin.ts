import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import type { Profile, Reports } from '../types/database';

export function useAdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  }, []);

  const deleteUser = useCallback(
    async (userId: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw new Error(error.message);
      await getUsers();
    },
    [getUsers]
  );

  const blockUser = useCallback(
    async (userId: string, blocked: boolean) => {
      const { error } = await supabase
        .from('profiles')
        .update({ bloque: blocked })
        .eq('id', userId);
      if (error) throw new Error(error.message);
      await getUsers();
    },
    [getUsers]
  );

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return { users, loading, error, getUsers, deleteUser, blockUser };
}

export async function getReports(): Promise<Reports> {
  const { count: total } = await supabase
    .from('demandes')
    .select('*', { count: 'exact', head: true });

  const { count: resolus } = await supabase
    .from('demandes')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'resolu');

  const { count: enCours } = await supabase
    .from('demandes')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'en_cours');

  const { count: nouveau } = await supabase
    .from('demandes')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'nouveau');

  return {
    total: total ?? 0,
    resolus: resolus ?? 0,
    en_cours: enCours ?? 0,
    nouveau: nouveau ?? 0,
  };
}

export async function deleteDemandeAdmin(demandeId: string) {
  const { error } = await supabase.from('demandes').delete().eq('id', demandeId);
  if (error) throw new Error(error.message);
}