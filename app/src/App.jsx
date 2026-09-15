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

  useEffect(() => {
    const toStore = signalements.map(({ photoPreview, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [signalements]);

  function handleNewSignalement(signalement) {
    setSignalements((prev) => [signalement, ...prev]);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CampusHelp</h1>
        <p>Signalez un problème dans votre établissement</p>
      </header>

      <main className="app-main">
        <SignalementForm onSubmit={handleNewSignalement} />
        <SignalementList signalements={signalements} />
      </main>
    </div>
  );
}

export default App;
