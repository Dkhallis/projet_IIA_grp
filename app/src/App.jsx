import { useEffect, useState } from "react";
import SignalementForm from "./components/SignalementForm";
import SignalementList from "./components/SignalementList";
import "./App.css";

const STORAGE_KEY = "campushelp_signalements";

function loadSignalements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((s) => ({ ...s, dateCreation: new Date(s.dateCreation) }));
  } catch {
    return [];
  }
}

function App() {
  const [signalements, setSignalements] = useState(loadSignalements);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const toStore = signalements.map(({ photoPreview, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [signalements]);

  function handleNewSignalement(signalement) {
    setSignalements((prev) => [{ ...signalement, commentaires: [] }, ...prev]);
  }

  function handleUpdateSignalement(id, updates) {
    setSignalements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  function handleAddComment(id, texte) {
    const comment = { id: crypto.randomUUID(), texte, date: new Date().toISOString() };
    setSignalements((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, commentaires: [...(s.commentaires || []), comment] } : s
      )
    );
  }

  const term = search.trim().toLowerCase();
  const filteredSignalements = term
    ? signalements.filter((s) =>
        [s.description, s.categorie, s.lieu].some((field) =>
          field?.toLowerCase().includes(term)
        )
      )
    : signalements;

  return (
    <div className="app">
      <header className="app-header">
        <h1>CampusHelp</h1>
        <p>Signalez un problème dans votre établissement</p>
      </header>

      <main className="app-main">
        <SignalementForm onSubmit={handleNewSignalement} />

        <input
          type="search"
          className="search-bar"
          placeholder="Rechercher un signalement (description, catégorie, lieu)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SignalementList
          signalements={filteredSignalements}
          onUpdate={handleUpdateSignalement}
          onAddComment={handleAddComment}
        />
      </main>
    </div>
  );
}

export default App;
