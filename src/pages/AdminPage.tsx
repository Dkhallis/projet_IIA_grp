import { useEffect, useState } from 'react';
import { useAdminUsers, getReports } from '../hooks/useAdmin';
import type { Reports } from '../types/database';

export default function AdminPage() {
  const { users, loading, error, deleteUser, blockUser } = useAdminUsers();
  const [reports, setReports] = useState<Reports | null>(null);

  useEffect(() => {
    getReports().then(setReports).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      await deleteUser(id);
    }
  };

  const handleBlock = async (id: string, blocked: boolean) => {
    await blockUser(id, !blocked);
  };

  return (
    <div className="admin-page">
      <h1>Espace Administrateur</h1>

      <section>
        <h2>Statistiques</h2>
        {reports ? (
          <ul>
            <li>Total signalements : {reports.total}</li>
            <li>Résolus : {reports.resolus}</li>
            <li>En cours : {reports.en_cours}</li>
            <li>Nouveaux : {reports.nouveau}</li>
          </ul>
        ) : (
          <p>Chargement des statistiques...</p>
        )}
      </section>

      <section>
        <h2>Utilisateurs</h2>
        {loading && <p>Chargement...</p>}
        {error && <p role="alert">Erreur : {error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.bloque ? 'Bloqué' : 'Actif'}</td>
                  <td>
                    <button onClick={() => handleBlock(u.id, u.bloque)}>
                      {u.bloque ? 'Débloquer' : 'Bloquer'}
                    </button>
                    <button onClick={() => handleDelete(u.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}