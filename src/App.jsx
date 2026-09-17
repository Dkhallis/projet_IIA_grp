import { useMemo, useState } from 'react'
import './App.css'

const seedReports = [
  { id: 'CH-1048', title: 'Wi-Fi instable en salle B204', description: 'La connexion se coupe toutes les dix minutes pendant les cours.', category: 'Wi-Fi', location: 'Bâtiment B · Salle 204', status: 'En cours', priority: 'Haute', date: '12 sept. 2026', author: 'Léa Martin', assignee: 'Marc Dubois', comments: 1, commentList: [{ author: 'Léa Martin', time: 'Il y a 2 h', text: 'Merci pour la prise en charge !' }] },
  { id: 'CH-1047', title: 'Projecteur hors service', description: 'Le projecteur affiche une image bleue malgré le changement de câble.', category: 'Matériel', location: 'Bâtiment A · Amphi 2', status: 'Nouveau', priority: 'Normale', date: '11 sept. 2026', author: 'Léa Martin', assignee: 'Non assigné', comments: 0, commentList: [] },
  { id: 'CH-1046', title: 'Fuite près de la cafétéria', description: 'Une fuite rend le passage glissant depuis ce matin.', category: 'Locaux', location: 'Bâtiment C · Rez-de-chaussée', status: 'Résolu', priority: 'Urgente', date: '10 sept. 2026', author: 'Thomas Bernard', assignee: 'Sarah Petit', comments: 0, commentList: [] },
  { id: 'CH-1045', title: 'Chaise cassée', description: 'Une chaise est inutilisable dans la salle de travail.', category: 'Mobilier', location: 'Bibliothèque · Salle 1', status: 'Refusé', priority: 'Faible', date: '09 sept. 2026', author: 'Léa Martin', assignee: 'Non assigné', comments: 0, commentList: [] },
]
const statusColors = { Nouveau: 'blue', 'En cours': 'amber', Résolu: 'green', Refusé: 'red' }
const priorities = ['Faible', 'Normale', 'Haute', 'Urgente']
const STUDENT_ACCOUNTS_KEY = 'campushelp_student_accounts'
const ADMIN_EMAIL = 'admin@mail.com'
const ADMIN_PASSWORD_HASH = 'b909c6702e754e2401640e5f77739027c0c9dd32c871bf8ccf31bc16f8334552'
const PERSONNEL_EMAIL = 'personnel@mail.com'
const PERSONNEL_PASSWORD_HASH = 'cf14f4b3c5390059631fffc776b772b2021da302aedffab97d201fcb2bba4223'

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const hash = await window.crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function getStudentAccounts() {
  try {
    return JSON.parse(window.localStorage.getItem(STUDENT_ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('Étudiant')
  const [reports, setReports] = useState(seedReports)
  const [page, setPage] = useState('overview')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tous les statuts')
  const [category, setCategory] = useState('Toutes les catégories')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(false)
  const [conversations, setConversations] = useState({})
  const [notifOpen, setNotifOpen] = useState(false)

  const canManage = user?.role === 'Personnel' || user?.role === 'Administrateur'
  const visibleReports = useMemo(() => reports.filter((item) => `${item.title} ${item.description} ${item.id}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Tous les statuts' || item.status === status) && (category === 'Toutes les catégories' || item.category === category)), [reports, query, status, category])
  const myReports = useMemo(() => visibleReports.filter((item) => item.author === user?.name), [visibleReports, user])
  function notify(message) { setNotice(message); window.setTimeout(() => setNotice(''), 2500) }
  async function login(event) {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value.trim().toLowerCase()
    const password = form.password.value
    if (!email || !password) { notify('Renseignez vos identifiants pour continuer.'); return }
    const passwordHash = await hashPassword(password)
    if (role === 'Administrateur') {
      if (email !== ADMIN_EMAIL || passwordHash !== ADMIN_PASSWORD_HASH) { notify('E-mail ou mot de passe administrateur incorrect.'); return }
      setUser({ name: 'Administrateur', email, role })
    } else if (role === 'Étudiant') {
      const account = getStudentAccounts().find((item) => item.email === email && item.passwordHash === passwordHash)
      if (!account) { notify('Identifiant ou mot de passe étudiant incorrect.'); return }
      setUser({ name: account.name, email, role })
    } else {
      if (email !== PERSONNEL_EMAIL || passwordHash !== PERSONNEL_PASSWORD_HASH) { notify('E-mail ou mot de passe personnel incorrect.'); return }
      setUser({ name: 'Équipe technique', email, role })
    }
    setPage('overview')
  }
  async function register(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.name.value.trim()
    const email = form.email.value.trim().toLowerCase()
    const password = form.password.value
    const confirmation = form.confirmation.value
    if (!name || !email || !password || !confirmation) { notify('Complétez tous les champs pour créer votre compte.'); return }
    if (password.length < 8) { notify('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== confirmation) { notify('Les mots de passe ne correspondent pas.'); return }
    const accounts = getStudentAccounts()
    if (accounts.some((item) => item.email === email)) { notify('Un compte étudiant existe déjà avec cet e-mail.'); return }
    accounts.push({ name, email, passwordHash: await hashPassword(password) })
    window.localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(accounts))
    notify('Compte étudiant créé. Bienvenue !')
    setRole('Étudiant')
    setUser({ name, email, role: 'Étudiant' })
    setPage('overview')
  }
  async function updateProfileName(name) {
    const accounts = getStudentAccounts()
    const index = accounts.findIndex((item) => item.email === user.email)
    if (index === -1) return
    accounts[index] = { ...accounts[index], name }
    window.localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(accounts))
    setUser((prev) => ({ ...prev, name }))
    notify('Nom mis à jour')
  }
  async function updateProfilePassword(currentPassword, newPassword) {
    const accounts = getStudentAccounts()
    const index = accounts.findIndex((item) => item.email === user.email)
    if (index === -1) return
    if (await hashPassword(currentPassword) !== accounts[index].passwordHash) { notify('Mot de passe actuel incorrect.'); return }
    accounts[index] = { ...accounts[index], passwordHash: await hashPassword(newPassword) }
    window.localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(accounts))
    notify('Mot de passe mis à jour')
  }
  function updateReport(id, changes, message) { setReports((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item)); notify(message) }
  function sendMessage(email, name, text, from) { setConversations((items) => { const existing = items[email]; return { ...items, [email]: { name: existing?.name || name || email, messages: [...(existing?.messages || []), { from, text, time: 'À l’instant' }] } } }) }
  function createReport(event) { event.preventDefault(); const form = event.currentTarget; const item = { id: `CH-${1050 + reports.length}`, title: form.title.value, description: form.description.value, category: form.category.value, location: form.location.value, status: 'Nouveau', priority: form.priority.value, date: 'Aujourd’hui', author: user.name, assignee: 'Non assigné', comments: 0, commentList: [] }; setReports((items) => [item, ...items]); setModal(false); notify('Signalement créé avec succès') }
  if (!user) return <Login role={role} setRole={setRole} onSubmit={login} onRegister={register} notice={notice} />
  const pageTitle = page === 'overview' ? `Bonjour ${user.name.split(' ')[0]} 👋` : page === 'profile' ? 'Mon profil' : page === 'reports' ? (canManage ? 'Centre des signalements' : 'Mes signalements') : page === 'all-reports' ? 'Tous les signalements' : page === 'messagerie' ? 'Messagerie' : page === 'analytics' ? 'Statistiques' : page === 'history' ? 'Historique des actions' : page === 'users' ? 'Utilisateurs' : 'Configuration'
  return <div className="app-shell"><Sidebar user={user} page={page} setPage={setPage} logout={() => setUser(null)} /><main className="main-content"><header className="topbar"><div><p className="topbar-kicker">CampusHelp / {user.role}</p><h1>{pageTitle}</h1></div><div className="topbar-actions"><div className="notif-wrap"><button className="icon-button" onClick={() => setNotifOpen((value) => !value)} aria-label="Notifications">♧<span>3</span></button>{notifOpen && <div className="notif-panel"><div className="notif-panel-head"><b>Notifications</b><button className="close-button" onClick={() => setNotifOpen(false)}>×</button></div><Activity text="Signalement pris en charge" time="Il y a 24 min" /><Activity text="Nouveau commentaire sur CH-1048" time="Il y a 1 h" /><Activity text="Votre demande CH-1046 est résolue" time="Hier" /></div>}</div><button type="button" className="user-chip" onClick={() => setPage('profile')}><span className="avatar">{user.name.split(' ').map((part) => part[0]).join('')}</span><span><b>{user.name}</b><small>{user.role}</small></span></button></div></header>{notice && <div className="toast">✓ {notice}</div>}{page === 'overview' && <Overview user={user} reports={reports} setPage={setPage} open={setSelected} create={() => setModal(true)} />}{page === 'profile' && <Profile user={user} reports={reports} updateName={updateProfileName} updatePassword={updateProfilePassword} />}{page === 'reports' && <Reports reports={canManage ? visibleReports : myReports} all={canManage ? reports : reports.filter((item) => item.author === user.name)} staff={canManage} query={query} setQuery={setQuery} status={status} setStatus={setStatus} category={category} setCategory={setCategory} open={setSelected} create={() => setModal(true)} update={updateReport} kicker={canManage ? 'Pilotage opérationnel' : 'Votre historique'} heading={canManage ? 'Toutes les demandes du campus' : 'Vos signalements'} showCreate={!canManage} />}{page === 'all-reports' && <Reports reports={visibleReports} all={reports} staff={canManage} query={query} setQuery={setQuery} status={status} setStatus={setStatus} category={category} setCategory={setCategory} open={setSelected} create={() => setModal(true)} update={updateReport} kicker="Vue communautaire" heading="Tous les signalements" showCreate={false} />}{page === 'messagerie' && <Messagerie user={user} conversations={conversations} send={sendMessage} />}{page === 'analytics' && <Analytics reports={reports} />}{page === 'history' && <History />}{page === 'users' && <Users notify={notify} />}{page === 'settings' && <Settings setPage={setPage} notify={notify} />}{selected && <Drawer report={reports.find((item) => item.id === selected)} close={() => setSelected(null)} staff={canManage} update={updateReport} user={user} />}{modal && <CreateModal close={() => setModal(false)} submit={createReport} />}</main></div>
}

function Login({ role, setRole, onSubmit, onRegister, notice }) {
  const [registerMode, setRegisterMode] = useState(false)
  return <main className="login-page"><section className="login-visual"><div className="brand-lockup"><span className="brand-icon">+</span><span>CAMPUS<b>HELP</b></span></div><div className="login-copy"><p className="eyebrow">La vie étudiante, ensemble</p><h1>Un campus qui<br /><em>vous écoute.</em></h1><p>Signalez les problèmes de votre établissement et suivez leur résolution, au même endroit.</p><div className="login-proof">✓ <span>Une demande. Une équipe. Une solution.</span></div></div><div className="visual-grid" /></section><section className="login-form"><div className="login-form-inner"><p className="mobile-brand">CAMPUS<span>HELP</span></p><p className="eyebrow">Espace sécurisé</p><h2>{registerMode ? 'Créer un compte.' : 'Bienvenue.'}</h2><p className="form-intro">{registerMode ? 'Créez votre accès étudiant avec vos identifiants personnels.' : 'Connectez-vous pour accéder à votre espace CampusHelp.'}</p>{registerMode ? <form onSubmit={onRegister}><label htmlFor="name">Nom complet</label><input id="name" name="name" required placeholder="Prénom Nom" /><label htmlFor="register-email">Adresse e-mail</label><input id="register-email" name="email" type="email" required placeholder="prenom.nom@campus.fr" /><label htmlFor="register-password">Mot de passe</label><input id="register-password" name="password" type="password" minLength="8" required placeholder="8 caractères minimum" /><label htmlFor="confirmation">Confirmer le mot de passe</label><input id="confirmation" name="confirmation" type="password" minLength="8" required placeholder="Répétez votre mot de passe" />{notice && <p className="error-message">{notice}</p>}<button className="primary-button" type="submit">Créer mon compte <span>→</span></button></form> : <form onSubmit={onSubmit}><label htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" required placeholder="prenom.nom@campus.fr" /><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required placeholder="Votre mot de passe" />{notice && <p className="error-message">{notice}</p>}<label>Se connecter en tant que</label><div className="role-picker">{['Étudiant', 'Personnel', 'Administrateur'].map((item) => <button type="button" className={role === item ? 'active' : ''} key={item} onClick={() => setRole(item)}>{item}</button>)}</div><button className="primary-button" type="submit">Accéder à mon espace <span>→</span></button></form>}<button className="auth-switch" type="button" onClick={() => setRegisterMode((value) => !value)}>{registerMode ? '← Retour à la connexion' : 'Créer un compte étudiant'}</button><p className="login-help">Besoin d’aide ? <a href="#help">Contacter l’assistance</a></p><p className="demo-hint">Les comptes étudiants sont enregistrés sur cet appareil.</p></div><footer>© 2026 CampusHelp · Plateforme de signalement</footer></section></main>
}
function Sidebar({ user, page, setPage, logout }) { const items = [['overview', '⌂', 'Vue d’ensemble'], ['profile', '☺', 'Mon profil'], ['reports', '▣', user.role === 'Étudiant' ? 'Mes signalements' : 'Signalements']]; if (user.role === 'Étudiant') items.push(['all-reports', '☰', 'Tous les signalements'], ['messagerie', '✉', 'Messagerie']); if (user.role === 'Administrateur') items.push(['messagerie', '✉', 'Messagerie'], ['analytics', '◔', 'Statistiques'], ['history', '◷', 'Historique'], ['users', '♙', 'Utilisateurs'], ['settings', '⚙', 'Configuration']); return <aside className="sidebar"><div className="sidebar-brand"><span className="brand-icon">+</span><span>CAMPUS<b>HELP</b></span></div><p className="nav-label">Navigation</p><nav>{items.map(([id, icon, label]) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(id)}><span>{icon}</span>{label}</button>)}</nav><div className="sidebar-bottom"><div className="campus-status"><span className="status-dot" />Campus Saint-Exupéry<small>Service opérationnel</small></div><button className="logout-button" onClick={logout}>↪ Se déconnecter</button></div></aside> }
function Overview({ user, reports, setPage, open, create }) { const own = user.role === 'Étudiant' ? reports.filter((item) => item.author === user.name) : reports; return <div className="page-stack"><section className="welcome-banner"><div><p className="eyebrow">Mardi 16 septembre 2026</p><h2>Votre campus avance avec vous.</h2><p>Retrouvez vos demandes et faites-nous savoir ce qui mérite notre attention.</p></div><button className="primary-button" onClick={create}>+ Nouveau signalement</button></section><section className="metric-grid"><Metric label="Signalements" value={own.length || 12} detail="depuis le début" tone="navy" /><Metric label="En cours" value={own.filter((item) => item.status === 'En cours').length || 5} detail="traités par l’équipe" tone="amber" /><Metric label="Résolus" value={own.filter((item) => item.status === 'Résolu').length || 8} detail="ce mois-ci" tone="green" /><Metric label="Temps moyen" value="2,4 j" detail="de prise en charge" tone="cream" /></section><div className="content-grid"><section className="panel"><div className="panel-heading"><div><p className="section-kicker">À suivre</p><h3>{user.role === 'Étudiant' ? 'Vos dernières demandes' : 'Demandes à traiter'}</h3></div><button className="text-button" onClick={() => setPage('reports')}>Tout voir →</button></div>{own.slice(0, 3).map((item) => <ReportRow key={item.id} report={item} onClick={() => open(item.id)} />)}</section><section className="panel activity-panel"><div className="panel-heading"><div><p className="section-kicker">En direct</p><h3>Activité récente</h3></div><span className="live-dot">● Live</span></div><Activity text="Signalement pris en charge" time="Il y a 24 min" /><Activity text="Nouveau commentaire sur CH-1048" time="Il y a 1 h" /><Activity text="Votre demande CH-1046 est résolue" time="Hier" /></section></div></div> }
function Metric({ label, value, detail, tone }) { return <div className={`metric metric-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }
function Activity({ text, time }) { return <div className="activity"><span className="activity-mark">↗</span><div><b>{text}</b><small>{time}</small></div></div> }
function ReportRow({ report, onClick }) { return <button className="report-row" onClick={onClick}><span className="report-symbol">{report.category === 'Wi-Fi' ? '⌁' : '◆'}</span><span className="report-main"><b>{report.title}</b><small>{report.id} · {report.location}</small></span><span className={`status-pill ${statusColors[report.status]}`}>{report.status}</span><span className="row-arrow">→</span></button> }

function Profile({ user, reports, updateName, updatePassword }) {
  const canEdit = user.role === 'Étudiant'
  const [name, setName] = useState(user.name)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const own = reports.filter((item) => item.author === user.name)
  function submitName(event) { event.preventDefault(); const value = name.trim(); if (value) updateName(value) }
  function submitPassword(event) {
    event.preventDefault()
    if (newPassword.length < 8) return
    if (newPassword !== confirmPassword) return
    updatePassword(currentPassword, newPassword)
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
  }
  return <div className="page-stack">
    <section className="panel profile-header"><span className="avatar large">{user.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{user.name}</h2><p>{user.role} · {user.email}</p></div></section>
    <section className="metric-grid"><Metric label="Signalements" value={own.length} detail="au total" tone="navy" /><Metric label="En cours" value={own.filter((item) => item.status === 'En cours').length} detail="en traitement" tone="amber" /><Metric label="Résolus" value={own.filter((item) => item.status === 'Résolu').length} detail="cloturés" tone="green" /><Metric label="Rôle" value={user.role} detail="sur CampusHelp" tone="cream" /></section>
    {canEdit ? <div className="profile-forms">
      <section className="panel"><h3>Nom affiché</h3><form onSubmit={submitName} className="create-form"><label>Nom complet<input value={name} onChange={(event) => setName(event.target.value)} required /></label><button className="primary-button" type="submit">Enregistrer</button></form></section>
      <section className="panel"><h3>Mot de passe</h3><form onSubmit={submitPassword} className="create-form"><label>Mot de passe actuel<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label><label>Nouveau mot de passe<input type="password" minLength="8" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label><label>Confirmer le nouveau mot de passe<input type="password" minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label><button className="primary-button" type="submit">Changer le mot de passe</button></form></section>
    </div> : <p className="empty-state">Ce compte de démonstration ne peut pas être modifié.</p>}
  </div>
}

function Reports({ reports, all, staff, query, setQuery, status, setStatus, category, setCategory, open, create, update, kicker, heading, showCreate }) { return <div className="page-stack"><div className="page-intro"><div><p className="section-kicker">{kicker}</p><h2>{heading}</h2><p>{reports.length} résultat{reports.length > 1 ? 's' : ''} · mis à jour à l’instant</p></div>{showCreate && <button className="primary-button" onClick={create}>+ Nouveau signalement</button>}</div><section className="filter-bar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un signalement..." /></div><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Tous les statuts</option>{Object.keys(statusColors).map((item) => <option key={item}>{item}</option>)}</select><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Toutes les catégories</option>{['Wi-Fi', 'Matériel', 'Locaux', 'Mobilier'].map((item) => <option key={item}>{item}</option>)}</select></section><section className="panel reports-table"><div className="table-head"><span>Signalement</span><span>Catégorie / lieu</span><span>Priorité</span><span>Statut</span><span>Action</span></div>{reports.map((item) => <div className="table-row" key={item.id}><div className="report-main"><b>{item.title}</b><small>{item.id} · {item.date} · {item.author}</small></div><span>{item.category}<small>{item.location}</small></span><select className="priority-select" value={item.priority} onChange={(event) => update(item.id, { priority: event.target.value }, 'Priorité mise à jour')} disabled={!staff}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select><span className={`status-pill ${statusColors[item.status]}`}>{item.status}</span><button className="small-action" onClick={() => open(item.id)}>Détails →</button></div>)}{!reports.length && <div className="empty-state">Aucun signalement ne correspond à vos filtres.</div>}</section><p className="table-caption">{all.length} signalements enregistrés · Les priorités urgentes sont signalées en rouge.</p></div> }

function Messagerie({ user, conversations, send }) {
  const isAdmin = user.role === 'Administrateur'
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')
  const threads = Object.entries(conversations)
  const activeThread = isAdmin ? conversations[selected] : conversations[user.email]
  const messages = activeThread?.messages || []
  function submit(event) {
    event.preventDefault()
    const value = text.trim()
    if (!value) return
    if (isAdmin) { if (!selected) return; send(selected, null, value, 'admin') } else { send(user.email, user.name, value, 'student') }
    setText('')
  }
  return <div className={isAdmin ? 'page-stack messagerie-layout' : 'page-stack'}>
    {isAdmin && <section className="panel conversation-list"><h3>Conversations</h3>{!threads.length && <p className="empty-state">Aucune conversation pour le moment.</p>}{threads.map(([email, thread]) => <button key={email} type="button" className={email === selected ? 'conversation-item active' : 'conversation-item'} onClick={() => setSelected(email)}><b>{thread.name}</b><small>{thread.messages[thread.messages.length - 1]?.text}</small></button>)}</section>}
    <section className="panel chat-panel">
      {isAdmin && !selected ? <div className="empty-state">Sélectionnez une conversation.</div> : <>
        <div className="chat-head">{isAdmin ? activeThread?.name : 'Administrateur'}</div>
        <div className="chat-messages">
          {!messages.length && <p className="empty-state">Aucun message. Lancez la conversation !</p>}
          {messages.map((message, index) => <div key={index} className={`chat-bubble ${message.from === (isAdmin ? 'admin' : 'student') ? 'mine' : 'theirs'}`}><span>{message.text}</span><small>{message.time}</small></div>)}
        </div>
        <form onSubmit={submit} className="comment-form chat-input"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Écrire un message..." /><button aria-label="Envoyer">→</button></form>
      </>}
      <div className="dino-track" aria-hidden="true"><div className="dino"><span>🦖</span></div></div>
    </section>
  </div>
}

function Drawer({ report, close, staff, update, user }) {
  const [comment, setComment] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const commentList = report.commentList || []
  function addComment(event) { event.preventDefault(); const text = comment.trim(); if (text) { update(report.id, { comments: report.comments + 1, commentList: [...commentList, { author: user.name, time: 'À l’instant', text }] }, 'Commentaire ajouté au signalement'); setComment('') } }
  function startEdit(index) { setEditingIndex(index); setEditText(commentList[index].text) }
  function cancelEdit() { setEditingIndex(null); setEditText('') }
  function saveEdit(event) { event.preventDefault(); const text = editText.trim(); if (text) { update(report.id, { commentList: commentList.map((item, index) => index === editingIndex ? { ...item, text } : item) }, 'Commentaire modifié'); cancelEdit() } }
  function deleteComment(index) { update(report.id, { comments: report.comments - 1, commentList: commentList.filter((_, i) => i !== index) }, 'Commentaire supprimé'); if (editingIndex === index) cancelEdit() }
  return <div className="drawer-backdrop" onClick={close}><aside className="drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><span className="section-kicker">{report.id}</span><button className="close-button" onClick={close}>×</button></div><h2>{report.title}</h2><div className="drawer-meta"><span className={`status-pill ${statusColors[report.status]}`}>{report.status}</span><span>● {report.priority}</span><span>{report.date}</span></div><p className="drawer-description">{report.description}</p>{[['Catégorie', report.category], ['Localisation', report.location], ['Signalé par', report.author]].map(([label, value]) => <div className="detail-block" key={label}><span>{label}</span><b>{value}</b></div>)}<div className="detail-block"><span>Intervenant</span>{staff ? <select value={report.assignee} onChange={(event) => update(report.id, { assignee: event.target.value }, 'Intervenant attribué')}><option>Non assigné</option><option>Marc Dubois</option><option>Sarah Petit</option><option>Service informatique</option></select> : <b>{report.assignee}</b>}</div>{staff && <div className="status-actions"><span>Modifier le statut</span><div>{Object.keys(statusColors).map((item) => <button key={item} className={report.status === item ? 'selected' : ''} onClick={() => update(report.id, { status: item }, `Statut changé en « ${item} »`)}>{item}</button>)}</div></div>}<div className="comments"><div className="comments-title"><b>Commentaires</b><span>{commentList.length}</span></div>{commentList.map((item, index) => <div className="comment" key={index}><span className="avatar mini">{item.author.split(' ').map((part) => part[0]).join('')}</span><div className="comment-content">{editingIndex === index ? <form onSubmit={saveEdit} className="comment-edit-form"><input value={editText} onChange={(event) => setEditText(event.target.value)} autoFocus /><button type="submit">Enregistrer</button><button type="button" onClick={cancelEdit}>Annuler</button></form> : <><p><b>{item.author}</b><small>{item.time}</small><span>{item.text}</span></p>{item.author === user.name && <div className="comment-actions"><button type="button" onClick={() => startEdit(index)}>Modifier</button><button type="button" className="delete" onClick={() => deleteComment(index)}>Supprimer</button></div>}</>}</div></div>)}{!commentList.length && <p className="empty-state">Aucun commentaire pour l’instant.</p>}<form onSubmit={addComment} className="comment-form"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ajouter un commentaire..." /><button aria-label="Envoyer">→</button></form></div></aside></div>
}
function CreateModal({ close, submit }) { return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><p className="section-kicker">Nouvelle demande</p><h2>Signaler un problème</h2></div><button className="close-button" onClick={close}>×</button></div><form onSubmit={submit} className="create-form"><label>Titre<input name="title" required placeholder="Ex. Éclairage défectueux" /></label><label>Description<textarea name="description" required rows="4" placeholder="Décrivez le problème rencontré..." /></label><div className="form-columns"><label>Catégorie<select name="category"><option>Wi-Fi</option><option>Matériel</option><option>Locaux</option><option>Mobilier</option></select></label><label>Lieu<input name="location" required placeholder="Ex. Bâtiment B · Salle 204" /></label></div><div className="form-columns"><label>Priorité<select name="priority"><option>Normale</option><option>Faible</option><option>Haute</option><option>Urgente</option></select></label><label>Photo<input type="file" accept="image/*" /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={close}>Annuler</button><button className="primary-button" type="submit">Créer le signalement →</button></div></form></div></div> }

function Analytics({ reports }) { return <div className="page-stack"><div className="page-intro"><div><p className="section-kicker">Vue d’ensemble</p><h2>La santé du campus</h2><p>Les tendances des signalements sur les 30 derniers jours.</p></div><button className="secondary-button">↓ Exporter</button></div><section className="metric-grid"><Metric label="Total signalements" value={1044 + reports.length} detail="+12 % vs. mois dernier" tone="navy" /><Metric label="Taux de résolution" value="78 %" detail="objectif : 80 %" tone="green" /><Metric label="Temps moyen" value="2,4 j" detail="-0,6 j vs. mois dernier" tone="amber" /><Metric label="Urgents" value="6" detail="à traiter aujourd’hui" tone="cream" /></section><div className="analytics-grid"><section className="panel chart-panel"><div className="panel-heading"><div><p className="section-kicker">Volume</p><h3>Signalements cette semaine</h3></div><b className="chart-total">42 <small>total</small></b></div><div className="bars">{[['Lun', 48], ['Mar', 68], ['Mer', 52], ['Jeu', 86], ['Ven', 63], ['Sam', 28], ['Dim', 19]].map(([day, height]) => <div className="bar-wrap" key={day}><span style={{ height: `${height}%` }} /><small>{day}</small></div>)}</div></section><section className="panel breakdown"><div className="panel-heading"><div><p className="section-kicker">Répartition</p><h3>Par catégorie</h3></div></div>{[['Wi-Fi', 36], ['Matériel', 28], ['Locaux', 21], ['Mobilier', 15]].map(([label, value]) => <div className="breakdown-row" key={label}><span className="legend" /><b>{label}</b><div className="progress"><span style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>)}</section></div></div> }
function History() { return <div className="page-stack"><div className="page-intro"><div><p className="section-kicker">Traçabilité</p><h2>Historique des actions</h2><p>Chaque modification importante est enregistrée.</p></div><button className="secondary-button">↓ Exporter</button></div><section className="panel history-list">{[['Alice Robert', 'a modifié la priorité de CH-1048', 'Aujourd’hui, 10:42', 'AR'], ['Marc Dubois', 'a pris en charge CH-1047', 'Aujourd’hui, 09:18', 'MD'], ['Sarah Petit', 'a passé CH-1046 au statut Résolu', 'Hier, 16:37', 'SP'], ['Alice Robert', 'a désactivé la catégorie « Mobilier »', 'Hier, 14:05', 'AR']].map(([name, action, date, initials]) => <div className="history-row" key={name + action}><span className="avatar">{initials}</span><p><b>{name}</b> {action}<small>{date}</small></p><span>↗</span></div>)}</section></div> }
function Users() { return <div className="page-stack"><div className="page-intro"><div><p className="section-kicker">Accès & permissions</p><h2>Utilisateurs</h2><p>Le compte administrateur est le seul compte actuellement enregistré.</p></div></div><section className="panel users-table"><div className="table-row"><div className="user-cell"><span className="avatar mini">AD</span><span><b>Administrateur</b><small>admin@mail.com</small></span></div><span>Administrateur</span><span className="state-active">Actif</span><span className="small-action">Compte principal</span></div></section></div> }
function Settings({ setPage, notify }) { return <div className="page-stack"><div className="page-intro"><div><p className="section-kicker">Référentiels</p><h2>Configuration</h2><p>Les catégories, lieux et priorités utilisés dans les signalements.</p></div></div><div className="settings-grid">{[['Catégories', '4 catégories actives', 'Wi-Fi · Matériel · Locaux · Mobilier'], ['Lieux', '12 lieux enregistrés', 'Bâtiments et salles du campus'], ['Priorités', '4 niveaux', 'Faible · Normale · Haute · Urgente']].map(([title, count, detail]) => <section className="panel setting-card" key={title}><span className="setting-icon">◆</span><h3>{title}</h3><b>{count}</b><p>{detail}</p><button className="text-button" onClick={() => notify(`Gestion des ${title.toLowerCase()} ouverte`)}>Gérer →</button></section>)}</div><section className="panel quick-links"><h3>Raccourcis administrateur</h3><button onClick={() => setPage('users')}>Gérer les utilisateurs <span>→</span></button><button onClick={() => notify('Catégorie ajoutée')}>Ajouter une catégorie <span>→</span></button><button onClick={() => notify('Lieu ajouté')}>Ajouter un lieu <span>→</span></button></section></div> }

export default App

