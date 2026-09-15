import { useState } from "react";

const CATEGORIES = [
  "Informatique",
  "Réseau / Wi-Fi",
  "Mobilier",
  "Bâtiment / Salle",
  "Autre",
];

const emptyForm = {
  description: "",
  categorie: CATEGORIES[0],
  lieu: "",
  photo: null,
  photoPreview: null,
};

export default function SignalementForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({ ...prev, photo: null, photoPreview: null }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photo: file, photoPreview: previewUrl }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.description.trim() || !form.lieu.trim()) {
      setError("La description et le lieu sont obligatoires.");
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      description: form.description.trim(),
      categorie: form.categorie,
      lieu: form.lieu.trim(),
      photoPreview: form.photoPreview,
      statut: "À traiter",
      dateCreation: new Date(),
    });

    setForm(emptyForm);
    setError("");
    e.target.reset();
  }

  return (
    <form className="signalement-form" onSubmit={handleSubmit}>
      <h2>Signaler un problème</h2>

      {error && <p className="form-error">{error}</p>}

      <label htmlFor="description">Description *</label>
      <textarea
        id="description"
        name="description"
        rows="3"
        placeholder="Décrivez le problème rencontré..."
        value={form.description}
        onChange={handleChange}
      />

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="categorie">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="lieu">Lieu *</label>
          <input
            id="lieu"
            name="lieu"
            type="text"
            placeholder="Ex : Salle B12, Bâtiment A..."
            value={form.lieu}
            onChange={handleChange}
          />
        </div>
      </div>

      <label htmlFor="photo">Photo (optionnelle)</label>
      <input id="photo" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />

      {form.photoPreview && (
        <img src={form.photoPreview} alt="Aperçu" className="photo-preview" />
      )}

      <button type="submit">Envoyer le signalement</button>
    </form>
  );
}
