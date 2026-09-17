import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

const statusColors = { nouveau: 'blue', en_cours: 'amber', resolu: 'green', refuse: 'red' }
const statusLabels = { nouveau: 'Nouveau', en_cours: 'En cours', resolu: 'Résolu', refuse: 'Refusé' }
const priorityLabels = { faible: 'Faible', normale: 'Normale', haute: 'Haute', urgente: 'Urgente' }
const priorities = ['faible', 'normale', 'haute', 'urgente']
const roleLabels = { etudiant: 'Étudiant', personnel: 'Personnel', admin: 'Administrateur' }

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [lieux, setLieux] = useState([])
  const [staffProfiles, setStaffProfiles] = useState([])
  const [allProfiles, setAllProfiles] = useState([])
  const [page, setPage] = useState('overview')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tous les statuts')
  const [category, setCategory] = useState('Toutes les catégories')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)

  const staff = profile?.role === 'personnel' || profile?.role === 'admin'
  const isAdmin = profile?.role === 'admin'

  function notify(message) { setNotice(message); window.setTimeout(() => setNotice(''), 2500) }

  // --- Session Supabase : on écoute les changements de connexion ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  // --- Une fois connecté, on va chercher le profil (nom, rôle, bloqué) ---
  useEffect(() => {
    if (!session) { setProfile(null); setAuthLoading(false); return }
    setAuthLoading(true)
    supabase.from('profiles').select('*').eq('id', session.user.id).single()
      .then(({ data, error }) => {
        if (error || !data) { notify('Profil introuvable.'); supabase.auth.signOut(); return }
        if (data.bloque) { notify('Ce compte est bloqué.'); supabase.auth.signOut(); return }
        setProfile(data)
        setAuthLoading(false)
      })
  }, [session])

  // --- Données communes chargées une fois connecté ---
  useEffect(() => {
    if (!profile) return
    fetchReports()
    fetchCategories()
    fetchLieux()
    fetchNotifications()
    if (staff) fetchStaffProfiles()
    if (isAdmin) fetchAllProfilesForAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function fetchReports() {
    const { data, error } = await supabase
      .from('demandes')
      .select(`
        id, titre, description, statut, priorite, photo_url, created_at,
        categorie_id, lieu_id, auteur_id, assigne_a,
        categories ( nom ),
        lieux ( nom, batiment ),
        auteur:profiles!demandes_auteur_id_fkey ( nom ),
        assigne:profiles!demandes_assigne_a_fkey ( nom )
      `)
      .order('created_at', { ascending: false })
    if (error) { notify(error.message); return }
    setReports(data)
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').eq('actif', true).order('nom')
    setCategories(data || [])
  }

  async function fetchLieux() {
    const { data } = await supabase.from('lieux').select('*').eq('actif', true).order('nom')
    setLieux(data || [])
  }

  async function fetchStaffProfiles() {
    const { data } = await supabase.from('profiles').select('*').in('role', ['personnel', 'admin']).order('nom')
    setStaffProfiles(data || [])
  }

  async function fetchAllProfilesForAdmin() {
    const { data } = await supabase.from('profiles').select('*').order('nom')
    setAllProfiles(data || [])
  }

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('destinataire_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) { notify(error.message); return }
    setNotifications(data || [])
  }

  async function markNotificationRead(id) {
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, lu: true } : item))
    await supabase.from('notifications').update({ lu: true }).eq('id', id)
  }

  async function markAllNotificationsRead() {
    const unreadIds = notifications.filter((item) => !item.lu).map((item) => item.id)
    if (!unreadIds.length) return
    setNotifications((items) => items.map((item) => ({ ...item, lu: true })))
    await supabase.from('notifications').update({ lu: true }).in('id', unreadIds)
  }

  async function login(event) {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value.trim()
    const password = form.password.value
    if (!email || !password) { notify('Renseignez vos identifiants pour continuer.'); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { notify('Identifiants incorrects.'); return }
  }

  async function register(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const password = form.password.value
    const confirmation = form.confirmation.value
    if (!name || !email || !password || !confirmation) { notify('Complétez tous les champs pour créer votre compte.'); return }
    if (password.length < 8) { notify('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== confirmation) { notify('Les mots de passe ne correspondent pas.'); return }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nom: name } } })
    if (error) { notify(error.message); return }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) { notify('Compte créé. Vérifiez votre e-mail pour confirmer avant de vous connecter.'); return }
  }

  function logout() {
    supabase.auth.signOut()
    setPage('overview')
  }

  async function updateProfileName(name) {
    const { error } = await supabase.from('profiles').update({ nom: name }).eq('id', profile.id)
    if (error) { notify(error.message); return }
    setProfile((prev) => ({ ...prev, nom: name }))
    notify('Nom mis à jour')
  }

  async function updateProfilePassword(currentPassword, newPassword) {
    const { error: checkError } = await supabase.auth.signInWithPassword({ email: profile.email, password: currentPassword })
    if (checkError) { notify('Mot de passe actuel incorrect.'); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { notify(error.message); return }
    notify('Mot de passe mis à jour')
  }

  async function updateReport(id, changes, message) {
    const dbChanges = {}
    if ('status' in changes) dbChanges.statut = changes.status
    if ('priority' in changes) dbChanges.priorite = changes.priority
    if ('assignee' in changes) dbChanges.assigne_a = changes.assignee || null
    const { error } = await supabase.from('demandes').update(dbChanges).eq('id', id)
    if (error) { notify(error.message); return }
    notify(message)
    fetchReports()
  }

  async function createReport(event) {
    event.preventDefault()
    const form = event.currentTarget
    const { error } = await supabase.from('demandes').insert({
      titre: form.title.value,
      description: form.description.value,
      categorie_id: form.category.value || null,
      lieu_id: form.location.value || null,
      priorite: form.priority.value,
      auteur_id: profile.id,
    })
    if (error) { notify(error.message); return }
    setModal(false)
    notify('Signalement créé avec succès')
    fetchReports()
  }

  async function toggleBlocked(userId, currentlyBlocked) {
    const { error } = await supabase.from('profiles').update({ bloque: !currentlyBlocked }).eq('id', userId)
    if (error) { notify(error.message); return }
    notify(currentlyBlocked ? 'Utilisateur réactivé' : 'Utilisateur bloqué')
    fetchAllProfilesForAdmin()
    fetchStaffProfiles()
  }

  const visibleReports = useMemo(() => reports.filter((item) =>
    `${item.titre} ${item.description ?? ''} ${item.id}`.toLowerCase().includes(query.toLowerCase())
    && (status === 'Tous les statuts' || item.statut === status)
    && (category === 'Toutes les catégories' || item.categories?.nom === category)
  ), [reports, query, status, category])

  if (authLoading) return <div className="app-shell"><p style={{ padding: 40 }}>Chargement…</p></div>
  if (!session || !profile) return <Login onSubmit={login} onRegister={register} notice={notice} />

  const displayUser = { name: profile.nom, role: roleLabels[profile.role] }
  const unreadCount = notifications.filter((item) => !item.lu).length
  const pageTitle = page === 'overview' ? `Bonjour ${displayUser.name.split(' ')[0]} 👋` : page === 'reports' ? (staff ? 'Centre des signalements' : 'Mes signalements') : page === 'profile' ? 'Mon profil' : page === 'users' ? 'Utilisateurs' : 'Configuration'

  return <div className="app-shell">
    <Sidebar user={displayUser} page={page} setPage={setPage} logout={logout} isAdmin={isAdmin} count={visibleReports.length} />
    <main className="main-content">
      <header className="topbar">
        <div><p className="topbar-kicker">CampusHelp / {displayUser.role}</p><h1>{pageTitle}</h1></div>
        <div className="topbar-actions">
          <div className="notif-wrap">
            <button className="icon-button" onClick={() => setNotifOpen((value) => !value)} aria-label="Notifications">♧{unreadCount > 0 && <span>{unreadCount}</span>}</button>
            {notifOpen && <div className="notif-panel">
              <div className="notif-panel-head"><b>Notifications</b>{unreadCount > 0 && <button className="text-button" onClick={markAllNotificationsRead}>Tout marquer lu</button>}<button className="close-button" onClick={() => setNotifOpen(false)}>×</button></div>
              {notifications.map((item) => <button key={item.id} className={item.lu ? 'activity notif-item' : 'activity notif-item unread'} onClick={() => markNotificationRead(item.id)}>
                <span className="activity-mark">↗</span>
                <div><b>{item.titre}</b><small>{item.message}</small><small>{new Date(item.created_at).toLocaleString('fr-FR')}</small></div>
              </button>)}
              {!notifications.length && <p className="empty-state">Aucune notification.</p>}
            </div>}
          </div>
          <button type="button" className="user-chip" onClick={() => setPage('profile')}><span className="avatar">{displayUser.name.split(' ').map((p) => p[0]).join('')}</span><span><b>{displayUser.name}</b><small>{displayUser.role}</small></span></button>
        </div>
      </header>
      {notice && <div className="toast">✓ {notice}</div>}
      {page === 'overview' && <Overview profile={profile} reports={reports} setPage={setPage} open={setSelected} create={() => setModal(true)} />}
      {page === 'reports' && <Reports reports={visibleReports} all={reports} staff={staff} query={query} setQuery={setQuery} status={status} setStatus={setStatus} category={category} setCategory={setCategory} open={setSelected} create={() => setModal(true)} update={updateReport} />}
      {page === 'profile' && <Profile profile={profile} displayUser={displayUser} reports={reports} updateName={updateProfileName} updatePassword={updateProfilePassword} />}
      {page === 'users' && isAdmin && <Users profiles={allProfiles} toggleBlocked={toggleBlocked} />}
      {selected && <Drawer reportId={selected} reports={reports} close={() => setSelected(null)} staff={staff} staffProfiles={staffProfiles} update={updateReport} profile={profile} notify={notify} />}
      {modal && <CreateModal close={() => setModal(false)} submit={createReport} categories={categories} lieux={lieux} />}
    </main>
  </div>
}

function Login({ onSubmit, onRegister, notice }) {
  const [registerMode, setRegisterMode] = useState(false)
  return <main className="login-page">
    <section className="login-visual">
      <div className="brand-lockup"><span className="brand-icon">+</span><span>CAMPUS<b>HELP</b></span></div>
      <div className="login-copy"><p className="eyebrow">La vie étudiante, ensemble</p><h1>Un campus qui<br /><em>vous écoute.</em></h1><p>Signalez les problèmes de votre établissement et suivez leur résolution, au même endroit.</p></div>
    </section>
    <section className="login-form">
      <div className="login-form-inner">
        <p className="mobile-brand">CAMPUS<span>HELP</span></p>
        <p className="eyebrow">Espace sécurisé</p>
        <h2>{registerMode ? 'Créer un compte.' : 'Bienvenue.'}</h2>
        <p className="form-intro">{registerMode ? 'Créez votre accès étudiant.' : 'Connectez-vous pour accéder à votre espace CampusHelp.'}</p>
        {registerMode ? <form onSubmit={onRegister}>
          <label htmlFor="name">Nom complet</label>
          <input id="name" name="name" required placeholder="Prénom Nom" />
          <label htmlFor="register-email">Adresse e-mail</label>
          <input id="register-email" name="email" type="email" required placeholder="prenom.nom@campus.fr" />
          <label htmlFor="register-password">Mot de passe</label>
          <input id="register-password" name="password" type="password" minLength="8" required placeholder="8 caractères minimum" />
          <label htmlFor="confirmation">Confirmer le mot de passe</label>
          <input id="confirmation" name="confirmation" type="password" minLength="8" required placeholder="Répétez votre mot de passe" />
          {notice && <p className="error-message">{notice}</p>}
          <button className="primary-button" type="submit">Créer mon compte <span>→</span></button>
        </form> : <form onSubmit={onSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input id="email" name="email" type="email" placeholder="prenom.nom@campus.fr" />
          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" placeholder="Votre mot de passe" />
          {notice && <p className="error-message">{notice}</p>}
          <button className="primary-button" type="submit">Accéder à mon espace <span>→</span></button>
        </form>}
        <button className="auth-switch" type="button" onClick={() => setRegisterMode((value) => !value)}>{registerMode ? '← Retour à la connexion' : 'Créer un compte étudiant'}</button>
        <p className="demo-hint">{registerMode ? 'Personnel et administrateurs : compte créé par l\u2019équipe technique dans Supabase.' : 'Ton rôle (étudiant / personnel / admin) est déterminé automatiquement par ton profil dans Supabase.'}</p>
      </div>
      <footer>© 2026 CampusHelp · Plateforme de signalement</footer>
    </section>
  </main>
}

function Sidebar({ user, page, setPage, logout, isAdmin, count }) {
  const items = [['overview', '⌂', 'Vue d\u2019ensemble'], ['reports', '▣', user.role === 'Étudiant' ? 'Mes signalements' : 'Signalements'], ['profile', '☺', 'Mon profil']]
  if (isAdmin) items.push(['users', '♙', 'Utilisateurs'])
  return <aside className="sidebar">
    <div className="sidebar-brand"><span className="brand-icon">+</span><span>CAMPUS<b>HELP</b></span></div>
    <p className="nav-label">Navigation</p>
    <nav>{items.map(([id, icon, label]) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(id)}><span>{icon}</span>{label}{id === 'reports' && <small>{count}</small>}</button>)}</nav>
    <div className="sidebar-bottom">
      <div className="campus-status"><span className="status-dot" />Campus<small>Service opérationnel</small></div>
      <button className="logout-button" onClick={logout}>↪ Se déconnecter</button>
    </div>
  </aside>
}

function Profile({ profile, displayUser, reports, updateName, updatePassword }) {
  const canEdit = profile.role === 'etudiant'
  const [name, setName] = useState(displayUser.name)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const own = reports.filter((item) => item.auteur_id === profile.id)
  function submitName(event) { event.preventDefault(); const value = name.trim(); if (value) updateName(value) }
  function submitPassword(event) {
    event.preventDefault()
    if (newPassword.length < 8) return
    if (newPassword !== confirmPassword) return
    updatePassword(currentPassword, newPassword)
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
  }
  return <div className="page-stack">
    <section className="panel profile-header"><span className="avatar large">{displayUser.name.split(' ').map((p) => p[0]).join('')}</span><div><h2>{displayUser.name}</h2><p>{displayUser.role} · {profile.email}</p></div></section>
    <section className="metric-grid">
      <Metric label="Signalements" value={own.length} detail="au total" tone="navy" />
      <Metric label="En cours" value={own.filter((i) => i.statut === 'en_cours').length} detail="en traitement" tone="amber" />
      <Metric label="Résolus" value={own.filter((i) => i.statut === 'resolu').length} detail="clôturés" tone="green" />
      <Metric label="Rôle" value={displayUser.role} detail="sur CampusHelp" tone="cream" />
    </section>
    {canEdit ? <div className="profile-forms">
      <section className="panel"><h3>Nom affiché</h3><form onSubmit={submitName} className="create-form"><label>Nom complet<input value={name} onChange={(e) => setName(e.target.value)} required /></label><button className="primary-button" type="submit">Enregistrer</button></form></section>
      <section className="panel"><h3>Mot de passe</h3><form onSubmit={submitPassword} className="create-form"><label>Mot de passe actuel<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></label><label>Nouveau mot de passe<input type="password" minLength="8" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></label><label>Confirmer le nouveau mot de passe<input type="password" minLength="8" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></label><button className="primary-button" type="submit">Changer le mot de passe</button></form></section>
    </div> : <p className="empty-state">Ce compte ne peut être modifié que par un administrateur.</p>}
  </div>
}

function Overview({ profile, reports, setPage, open, create }) {
  const own = profile.role === 'etudiant' ? reports.filter((item) => item.auteur_id === profile.id) : reports
  return <div className="page-stack">
    <section className="welcome-banner">
      <div><p className="eyebrow">Votre campus</p><h2>Votre campus avance avec vous.</h2><p>Retrouvez vos demandes et faites-nous savoir ce qui mérite notre attention.</p></div>
      <button className="primary-button" onClick={create}>+ Nouveau signalement</button>
    </section>
    <section className="metric-grid">
      <Metric label="Signalements" value={own.length} detail="au total" tone="navy" />
      <Metric label="En cours" value={own.filter((i) => i.statut === 'en_cours').length} detail="traités par l\u2019équipe" tone="amber" />
      <Metric label="Résolus" value={own.filter((i) => i.statut === 'resolu').length} detail="ce mois-ci" tone="green" />
      <Metric label="Nouveaux" value={own.filter((i) => i.statut === 'nouveau').length} detail="en attente" tone="cream" />
    </section>
    <section className="panel">
      <div className="panel-heading"><div><p className="section-kicker">À suivre</p><h3>{profile.role === 'etudiant' ? 'Vos dernières demandes' : 'Demandes à traiter'}</h3></div><button className="text-button" onClick={() => setPage('reports')}>Tout voir →</button></div>
      {own.slice(0, 5).map((item) => <ReportRow key={item.id} report={item} onClick={() => open(item.id)} />)}
      {!own.length && <p className="empty-state">Aucun signalement pour l\u2019instant.</p>}
    </section>
  </div>
}

function Metric({ label, value, detail, tone }) { return <div className={`metric metric-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }

function ReportRow({ report, onClick }) {
  return <button className="report-row" onClick={onClick}>
    <span className="report-symbol">◆</span>
    <span className="report-main"><b>{report.titre}</b><small>{report.categories?.nom} · {report.lieux ? `${report.lieux.batiment} · ${report.lieux.nom}` : 'Lieu non précisé'}</small></span>
    <span className={`status-pill ${statusColors[report.statut]}`}>{statusLabels[report.statut]}</span>
    <span className="row-arrow">→</span>
  </button>
}

function Reports({ reports, all, staff, query, setQuery, status, setStatus, category, setCategory, open, create, update }) {
  const categoryNames = [...new Set(all.map((r) => r.categories?.nom).filter(Boolean))]
  return <div className="page-stack">
    <div className="page-intro">
      <div><p className="section-kicker">{staff ? 'Pilotage opérationnel' : 'Votre historique'}</p><h2>{staff ? 'Toutes les demandes du campus' : 'Vos signalements'}</h2><p>{reports.length} résultat{reports.length > 1 ? 's' : ''}</p></div>
      {!staff && <button className="primary-button" onClick={create}>+ Nouveau signalement</button>}
    </div>
    <section className="filter-bar">
      <div className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un signalement..." /></div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}><option>Tous les statuts</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}><option>Toutes les catégories</option>{categoryNames.map((c) => <option key={c}>{c}</option>)}</select>
    </section>
    <section className="panel reports-table">
      <div className="table-head"><span>Signalement</span><span>Catégorie / lieu</span><span>Priorité</span><span>Statut</span><span>Action</span></div>
      {reports.map((item) => <div className="table-row" key={item.id}>
        <div className="report-main"><b>{item.titre}</b><small>{new Date(item.created_at).toLocaleDateString('fr-FR')} · {item.auteur?.nom}</small></div>
        <span>{item.categories?.nom}<small>{item.lieux ? `${item.lieux.batiment} · ${item.lieux.nom}` : ''}</small></span>
        <select className="priority-select" value={item.priorite} onChange={(e) => update(item.id, { priority: e.target.value }, 'Priorité mise à jour')} disabled={!staff}>
          {priorities.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}
        </select>
        <span className={`status-pill ${statusColors[item.statut]}`}>{statusLabels[item.statut]}</span>
        <button className="small-action" onClick={() => open(item.id)}>Détails →</button>
      </div>)}
      {!reports.length && <div className="empty-state">Aucun signalement ne correspond à vos filtres.</div>}
    </section>
  </div>
}

function Drawer({ reportId, reports, close, staff, staffProfiles, update, profile, notify }) {
  const report = reports.find((r) => r.id === reportId)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    supabase.from('commentaires').select('*, auteur:profiles(nom)').eq('demande_id', reportId).order('created_at')
      .then(({ data }) => setComments(data || []))
  }, [reportId])

  async function addComment(event) {
    event.preventDefault()
    if (!comment.trim()) return
    const { error } = await supabase.from('commentaires').insert({ demande_id: reportId, auteur_id: profile.id, contenu: comment })
    if (error) { notify(error.message); return }
    setComment('')
    const { data } = await supabase.from('commentaires').select('*, auteur:profiles(nom)').eq('demande_id', reportId).order('created_at')
    setComments(data || [])
  }

  if (!report) return null
  return <div className="drawer-backdrop" onClick={close}>
    <aside className="drawer" onClick={(e) => e.stopPropagation()}>
      <div className="drawer-head"><span className="section-kicker">{report.id.slice(0, 8)}</span><button className="close-button" onClick={close}>×</button></div>
      <h2>{report.titre}</h2>
      <div className="drawer-meta"><span className={`status-pill ${statusColors[report.statut]}`}>{statusLabels[report.statut]}</span><span>● {priorityLabels[report.priorite]}</span><span>{new Date(report.created_at).toLocaleDateString('fr-FR')}</span></div>
      <p className="drawer-description">{report.description}</p>
      {[['Catégorie', report.categories?.nom], ['Localisation', report.lieux ? `${report.lieux.batiment} · ${report.lieux.nom}` : '—'], ['Signalé par', report.auteur?.nom]].map(([label, value]) => <div className="detail-block" key={label}><span>{label}</span><b>{value}</b></div>)}
      <div className="detail-block">
        <span>Intervenant</span>
        {staff
          ? <select value={report.assigne_a || ''} onChange={(e) => update(report.id, { assignee: e.target.value }, 'Intervenant attribué')}>
              <option value="">Non assigné</option>
              {staffProfiles.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          : <b>{report.assigne?.nom || 'Non assigné'}</b>}
      </div>
      {staff && <div className="status-actions"><span>Modifier le statut</span><div>{Object.entries(statusLabels).map(([key, label]) => <button key={key} className={report.statut === key ? 'selected' : ''} onClick={() => update(report.id, { status: key }, `Statut changé en « ${label} »`)}>{label}</button>)}</div></div>}
      <div className="comments">
        <div className="comments-title"><b>Commentaires</b><span>{comments.length}</span></div>
        {comments.map((c) => <div className="comment" key={c.id}><span className="avatar mini">{c.auteur?.nom?.split(' ').map((p) => p[0]).join('')}</span><p><b>{c.auteur?.nom}</b><small>{new Date(c.created_at).toLocaleString('fr-FR')}</small><span>{c.contenu}</span></p></div>)}
        <form onSubmit={addComment} className="comment-form"><input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ajouter un commentaire..." /><button aria-label="Envoyer">→</button></form>
      </div>
    </aside>
  </div>
}

function CreateModal({ close, submit, categories, lieux }) {
  return <div className="modal-backdrop" onClick={close}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-head"><div><p className="section-kicker">Nouvelle demande</p><h2>Signaler un problème</h2></div><button className="close-button" onClick={close}>×</button></div>
      <form onSubmit={submit} className="create-form">
        <label>Titre<input name="title" required placeholder="Ex. Éclairage défectueux" /></label>
        <label>Description<textarea name="description" required rows="4" placeholder="Décrivez le problème rencontré..." /></label>
        <div className="form-columns">
          <label>Catégorie<select name="category">{categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}</select></label>
          <label>Lieu<select name="location">{lieux.map((l) => <option key={l.id} value={l.id}>{l.batiment} · {l.nom}</option>)}</select></label>
        </div>
        <label>Priorité<select name="priority" defaultValue="normale">{priorities.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}</select></label>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={close}>Annuler</button><button className="primary-button" type="submit">Créer le signalement →</button></div>
      </form>
    </div>
  </div>
}

function Users({ profiles, toggleBlocked }) {
  return <div className="page-stack">
    <div className="page-intro"><div><p className="section-kicker">Accès & permissions</p><h2>Utilisateurs</h2><p>Gérez les comptes et les rôles de votre établissement.</p></div></div>
    <section className="panel users-table">
      {profiles.map((p) => <div className="table-row" key={p.id}>
        <div className="user-cell"><span className="avatar mini">{p.nom.split(' ').map((n) => n[0]).join('')}</span><span><b>{p.nom}</b><small>{p.email}</small></span></div>
        <span>{roleLabels[p.role]}</span>
        <span className={p.bloque ? 'state-blocked' : 'state-active'}>{p.bloque ? 'Bloqué' : 'Actif'}</span>
        <button className="small-action" onClick={() => toggleBlocked(p.id, p.bloque)}>{p.bloque ? 'Réactiver' : 'Bloquer'}</button>
      </div>)}
      {!profiles.length && <p className="empty-state">Aucun utilisateur.</p>}
    </section>
  </div>
}

export default App