const STATUT_CLASS = {
  "À traiter": "badge badge-todo",
  "En cours": "badge badge-progress",
  "Résolu": "badge badge-done",
};

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function SignalementList({ signalements }) {
  if (signalements.length === 0) {
    return (
      <div className="signalement-list">
        <h2>Signalements ({signalements.length})</h2>
        <p className="empty-state">Aucun signalement pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="signalement-list">
      <h2>Signalements ({signalements.length})</h2>
      <ul>
        {signalements.map((s) => (
          <li key={s.id} className="signalement-card">
            {s.photoPreview && (
              <img src={s.photoPreview} alt="" className="card-photo" />
            )}
            <div className="card-body">
              <div className="card-header">
                <span className="card-categorie">{s.categorie}</span>
                <span className={STATUT_CLASS[s.statut] || "badge"}>{s.statut}</span>
              </div>
              <p className="card-description">{s.description}</p>
              <div className="card-meta">
                <span>📍 {s.lieu}</span>
                <span>🕒 {formatDate(s.dateCreation)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
