import { useState } from "react";

const CATEGORIES = [
  "Informatique",
  "Réseau / Wi-Fi",
  "Mobilier",
  "Bâtiment / Salle",
  "Autre",
];

const STATUTS = ["À traiter", "En cours", "Résolu"];

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
  }).format(new Date(date));
}

function SignalementCard({ signalement: s, onUpdate, onAddComment, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    description: s.description,
    categorie: s.categorie,
    lieu: s.lieu,
  });
  const [commentText, setCommentText] = useState("");

  function startEdit() {
    setEditForm({ description: s.description, categorie: s.categorie, lieu: s.lieu });
    setIsEditing(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editForm.description.trim() || !editForm.lieu.trim()) return;
    onUpdate(s.id, {
      description: editForm.description.trim(),
      categorie: editForm.categorie,
      lieu: editForm.lieu.trim(),
    });
    setIsEditing(false);
  }

  function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(s.id, commentText.trim());
    setCommentText("");
  }

  function handleDelete() {
    if (window.confirm("Supprimer ce signalement ?")) {
      onDelete(s.id);
    }
  }

  if (isEditing) {
    return (
      <li className="signalement-card">
        <form className="edit-form" onSubmit={saveEdit}>
          <textarea
            rows="2"
            value={editForm.description}
            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="form-row">
            <div className="form-field">
              <select
                value={editForm.categorie}
                onChange={(e) => setEditForm((f) => ({ ...f, categorie: e.target.value }))}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <input
                type="text"
                value={editForm.lieu}
                onChange={(e) => setEditForm((f) => ({ ...f, lieu: e.target.value }))}
              />
            </div>
          </div>
          <div className="edit-actions">
            <button type="submit">Enregistrer</button>
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="signalement-card">
      {s.photoPreview && <img src={s.photoPreview} alt="" className="card-photo" />}
      <div className="card-body">
        <div className="card-header">
          <span className="card-categorie">{s.categorie}</span>
          <div className="card-header-right">
            <select
              className={`statut-select ${STATUT_CLASS[s.statut] || "badge"}`}
              value={s.statut}
              onChange={(e) => onUpdate(s.id, { statut: e.target.value })}
            >
              {STATUTS.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
            <button type="button" className="btn-link" onClick={startEdit}>
              Modifier
            </button>
            <button type="button" className="btn-link btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
        <p className="card-description">{s.description}</p>
        <div className="card-meta">
          <span>📍 {s.lieu}</span>
          <span>🕒 {formatDate(s.dateCreation)}</span>
        </div>

        <div className="comments">
          {(s.commentaires || []).length > 0 && (
            <ul className="comment-list">
              {s.commentaires.map((c) => (
                <li key={c.id} className="comment-item">
                  <p>{c.texte}</p>
                  <span className="comment-date">{formatDate(c.date)}</span>
                </li>
              ))}
            </ul>
          )}
          <form className="comment-form" onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Ajouter</button>
          </form>
        </div>
      </div>
    </li>
  );
}

export default function SignalementList({ signalements, onUpdate, onAddComment, onDelete }) {
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
          <SignalementCard
            key={s.id}
            signalement={s}
            onUpdate={onUpdate}
            onAddComment={onAddComment}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
