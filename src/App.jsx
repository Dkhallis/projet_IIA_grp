import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Veuillez renseigner votre adresse e-mail et votre mot de passe.')
      return
    }

    setIsConnected(true)
  }

  return (
    <main className="login-page">
      <section className="welcome-panel" aria-label="Présentation de CAMPUSHELP">
        <div className="brand-mark" aria-hidden="true">
          <span>+</span>
        </div>
        <p className="eyebrow">La vie étudiante, ensemble</p>
        <h1>Bienvenue sur<br /><strong>CAMPUSHELP</strong></h1>
        <p className="welcome-copy">
          Un établissement plus simple à vivre commence par un signalement.
          Retrouvez votre communauté et faites avancer votre campus.
        </p>
        <div className="help-note">
          <span className="note-icon" aria-hidden="true">i</span>
          <span>Un souci dans votre établissement ? Signalez-le en quelques clics.</span>
        </div>
        <div className="panel-lines" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="form-panel">
        <div className="form-content">
          <p className="mobile-brand">CAMPUS<span>HELP</span></p>
          <p className="eyebrow">Espace étudiant</p>
          <h2>Connectez-vous</h2>
          <p className="form-intro">Accédez à votre espace pour suivre vos signalements.</p>

          {isConnected ? (
            <div className="success-message" role="status">
              <span className="success-icon">✓</span>
              <strong>Connexion réussie !</strong>
              <span>Votre espace CAMPUSHELP est prêt.</span>
              <button type="button" onClick={() => setIsConnected(false)}>Retour</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email">Adresse e-mail</label>
              <div className="input-wrap">
                <span className="field-icon" aria-hidden="true">@</span>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="prenom.nom@etablissement.fr" autoComplete="email" />
              </div>

              <div className="password-heading">
                <label htmlFor="password">Mot de passe</label>
                <a href="#mot-de-passe-oublie">Mot de passe oublié ?</a>
              </div>
              <div className="input-wrap">
                <span className="field-icon lock" aria-hidden="true">▣</span>
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" autoComplete="current-password" />
                <button className="toggle-password" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? 'Masquer' : 'Voir'}</button>
              </div>

              {error && <p className="error-message" role="alert">{error}</p>}
              <button className="submit-button" type="submit">Se connecter <span aria-hidden="true">→</span></button>
            </form>
          )}

          <p className="register-link">Pas encore de compte ? <a href="#inscription">Créer un compte</a></p>
        </div>
        <footer>© 2024 CAMPUSHELP <span>•</span> Une communauté qui avance</footer>
      </section>
    </main>
  )
}

export default App
