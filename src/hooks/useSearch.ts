import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import type { Demande } from '../types/database';

export interface SearchFilters {
  q?: string;
  categorie?: string;
  lieu?: string;
  date?: string;
}

export function useSearchDemandes() {
  const [results, setResults] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDemandes = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('demandes')
      .select('*, categorie:categories(id, nom), lieu:lieux(id, nom, batiment)')
      .order('created_at', { ascending: false });

    if (filters.q) {
      query = query.or(`titre.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }
    if (filters.categorie) {
      query = query.eq('categorie_id', filters.categorie);
    }
    if (filters.lieu) {
      query = query.eq('lieu_id', filters.lieu);
    }
    if (filters.date) {
      query = query
        .gte('created_at', `${filters.date}T00:00:00`)
        .lte('created_at', `${filters.date}T23:59:59`);
    }

    const { data, error } = await query;
    if (error) {
      setError(error.message);
      setResults([]);
    } else {
      setResults((data as unknown as Demande[]) ?? []);
    }
    setLoading(false);
  }, []);

  const filterByCategory = useCallback(
    (categorieId: string) => searchDemandes({ categorie: categorieId }),
    [searchDemandes]
  );
  const filterByLocation = useCallback(
    (lieuId: string) => searchDemandes({ lieu: lieuId }),
    [searchDemandes]
  );
  const filterByDate = useCallback(
    (date: string) => searchDemandes({ date }),
    [searchDemandes]
  );

  return { results, loading, error, searchDemandes, filterByCategory, filterByLocation, filterByDate };
}