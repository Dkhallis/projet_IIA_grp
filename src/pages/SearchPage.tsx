import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { useSearchDemandes } from '../hooks/useSearch';
import type { Categorie, Lieu } from '../types/database';

export default function SearchPage() {
  const { results, loading, error, searchDemandes } = useSearchDemandes();
  const [q, setQ] = useState('');
  const [categorie, setCategorie] = useState('');
  const [lieu, setLieu] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data ?? []));
    supabase.from('lieux').select('*').then(({ data }) => setLieux(data ?? []));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchDemandes({ q, categorie, lieu, date });
  };

  return (
    <div className="search-page">
      <h1>Rechercher un signalement</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mot-clé (titre, description...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>

        <select value={lieu} onChange={(e) => setLieu(e.target.value)}>
          <option value="">Tous les lieux</option>
          {lieux.map((l) => (
            <option key={l.id} value={l.id}>{l.nom}</option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button type="submit">Rechercher</button>
      </form>

      {loading && <p>Recherche en cours...</p>}
      {error && <p role="alert">Erreur : {error}</p>}
      {!loading && !error && results.length === 0 && <p>Aucun résultat.</p>}

      <section>
        {results.map((d) => (
          <article key={d.id} className="demande-card">
            <h3>{d.titre}</h3>
            <p>{d.description}</p>
            <span>Catégorie : {d.categorie?.nom ?? '-'}</span> |{' '}
            <span>Lieu : {d.lieu?.nom ?? '-'}</span> |{' '}
            <span>Statut : {d.statut}</span>
          </article>
        ))}
      </section>
    </div>
  );
}