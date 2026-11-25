import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  ShieldCheck, Heart, Home, MapPinned, Users, Route, History, Settings, LogOut,
  Bell, Menu, X, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, MapPin,
  Navigation, Siren, BatteryFull, BatteryLow, BatteryCharging, Clock3, CheckCircle2,
  CircleAlert, Plus, RefreshCw, LocateFixed, Trash2, Check, XCircle, Activity,
  Smartphone, ChevronRight, ShieldAlert, Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const errorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';
const initials = (name = 'U') => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.setView([position.latitude, position.longitude], 15); }, [position, map]);
  return null;
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault(); setMessage('');
    if (mode === 'register' && form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.'); setMessageType('error'); return;
    }
    setBusy(true);
    try {
      const payload = mode === 'register'
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
      const response = await api.post(`/auth/${mode}`, payload);
      localStorage.setItem('token', response.data.token);
      onAuthenticated(response.data.user, response.data.token);
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to connect to SafeWay. Check that the backend is running on port 8081.'));
      setMessageType('error');
    } finally { setBusy(false); }
  }

  return <div className="auth-shell">
    <div className="auth-art">
      <div className="auth-brand"><span className="brand-mark"><ShieldCheck size={23}/></span><span>SafeWay<small>WOMEN SAFETY NETWORK</small></span></div>
      <div className="art-copy"><span className="eyebrow"><Sparkles size={14}/> YOUR SAFETY, YOUR CONTROL</span>
        <h1>Stay safe.<br/><em>Stay connected.</em></h1>
        <p>A thoughtful safety companion for sharing your location, checking in on journeys and reaching the people you trust.</p>
        <div className="art-points"><span><CheckCircle2 size={16}/> Consent-based location sharing</span><span><CheckCircle2 size={16}/> Trusted contacts & SOS alerts</span><span><CheckCircle2 size={16}/> Safe journey monitoring</span></div>
      </div>
      <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
      <div className="safety-illustration"><div className="illustration-glow"/><div className="illustration-shield"><ShieldCheck size={92} strokeWidth={1.35}/></div><div className="floating-pin"><MapPin size={23}/></div><div className="floating-heart"><Heart size={20} fill="currentColor"/></div></div>
      <div className="art-footer">A safer way to stay in touch <span>•</span> Built around trust</div>
    </div>
    <div className="auth-side">
      <div className="auth-topline"><span>SafeWay <b>/ {mode === 'login' ? 'Welcome back' : 'Create account'}</b></span><span className="secure-label"><ShieldCheck size={14}/> Secure access</span></div>
      <div className="auth-card">
        <div className="auth-icon"><ShieldCheck size={25}/></div>
        <span className="eyebrow">{mode === 'login' ? 'GOOD TO SEE YOU AGAIN' : 'JOIN THE SAFETY NETWORK'}</span>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="muted">{mode === 'login' ? 'Sign in to manage your safety network.' : 'Set up your SafeWay account in a few steps.'}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && <label>Full name<div className="input-wrap"><User size={17}/><input value={form.name} onChange={update('name')} placeholder="Enter your full name" required autoComplete="name"/></div></label>}
          <label>Email address<div className="input-wrap"><Mail size={17}/><input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required autoComplete="email"/></div></label>
          <label>Password<div className="input-wrap"><Lock size={17}/><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="At least 8 characters" required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/><button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {mode === 'register' && <label>Confirm password<div className="input-wrap"><Lock size={17}/><input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Re-enter your password" required minLength={8}/><button type="button" className="icon-button" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">{showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>}
          {message && <div className={`alert ${messageType}`}><CircleAlert size={16}/>{message}</div>}
          <button className="primary-btn auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to SafeWay' : 'Create my account'} <ArrowRight size={17}/></button>
        </form>
        <div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}> {mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
        <div className="auth-disclaimer"><ShieldCheck size={15}/> Your location is shared only when you choose to share it.</div>
      </div>
      <div className="auth-bottom">© {new Date().getFullYear()} SafeWay <span>•</span> Women Safety Tracking System</div>
    </div>
  </div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('Dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);
  const [location, setLocation] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [battery, setBattery] = useState(null);
  const [batterySupported, setBatterySupported] = useState(true);
  const [batteryUpdated, setBatteryUpdated] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [arrival, setArrival] = useState('');
  const [loading, setLoading] = useState(false);
  const watchId = useRef(null);
  const batteryManager = useRef(null);
  const batteryHandler = useRef(null);
  const noticeTimer = useRef(null);

  const toast = useCallback((text, type = 'success') => {
    setNotice({ text, type });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const [me, c, j, n, s] = await Promise.all([
        api.get('/auth/me'), api.get('/contacts'), api.get('/journeys'), api.get('/notifications'), api.get('/sos/history')
      ]);
      setUser(me.data); setContacts(c.data || []); setJourneys(j.data || []); setNotifications(n.data || []); setSosHistory(s.data || []);
      try {
        const latest = await api.get(`/users/${me.data.id}/location/latest`);
        setLocation(latest.data);
      } catch { /* No location has been shared yet. */ }
      try {
        const latestBattery = await api.get(`/battery/latest/${me.data.id}`);
        setBattery({ level: latestBattery.data.level, charging: latestBattery.data.charging });
        setBatteryUpdated(latestBattery.data.reportedAt);
      } catch { /* No battery report yet. */ }
    } catch (error) {
      localStorage.removeItem('token'); setToken(''); setUser(null);
      toast(errorMessage(error, 'Your session expired. Please sign in again.'), 'error');
    }
  }, [toast]);

  useEffect(() => { if (token) loadDashboard(); }, [token, loadDashboard]);
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);

  const reportBattery = useCallback(async (manager) => {
    const level = Math.round(manager.level * 100);
    const charging = Boolean(manager.charging);
    setBattery({ level, charging }); setBatteryUpdated(new Date().toISOString());
    try { await api.post('/battery', { level, charging }); }
    catch (error) { console.warn('Battery report could not be saved:', errorMessage(error)); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!token) return undefined;
    if (!navigator.getBattery) { setBatterySupported(false); return undefined; }
    navigator.getBattery().then((manager) => {
      if (cancelled) return;
      batteryManager.current = manager;
      const handler = () => reportBattery(manager);
      batteryHandler.current = handler;
      handler();
      manager.addEventListener('levelchange', handler);
      manager.addEventListener('chargingchange', handler);
    }).catch(() => setBatterySupported(false));
    return () => {
      cancelled = true;
      const manager = batteryManager.current; const handler = batteryHandler.current;
      if (manager && handler) {
        manager.removeEventListener('levelchange', handler);
        manager.removeEventListener('chargingchange', handler);
      }
      batteryManager.current = null; batteryHandler.current = null;
    };
  }, [token, reportBattery]);

  const stopSharing = useCallback(() => {
    if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null; setSharing(false); toast('Live location sharing stopped.');
  }, [toast]);

  const uploadPosition = useCallback(async (position) => {
    const coords = position.coords;
    const next = { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy, recordedAt: new Date().toISOString(), user };
    try {
      await api.post('/locations', { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
      setLocation(next);
    } catch (error) { toast(errorMessage(error, 'Location upload failed.'), 'error'); }
  }, [toast, user]);

  const startSharing = () => {
    if (!navigator.geolocation) { toast('This browser does not support GPS location.', 'error'); return; }
    if (!window.isSecureContext && window.location.hostname !== 'localhost') { toast('GPS requires HTTPS or localhost.', 'error'); return; }
    if (watchId.current !== null) return;
    setSharing(true); toast('Requesting GPS permission…', 'info');
    watchId.current = navigator.geolocation.watchPosition(
      uploadPosition,
      (error) => { setSharing(false); watchId.current = null; toast(error.message || 'Unable to access GPS location.', 'error'); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  };

  useEffect(() => () => { if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current); }, []);

  const logout = () => {
    if (watchId.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null; localStorage.removeItem('token'); setToken(''); setUser(null); setSharing(false);
  };

  const refresh = async () => { setLoading(true); await loadDashboard(); setLoading(false); toast('Dashboard refreshed.'); };

  async function inviteContact(event) {
    event.preventDefault();
    try { await api.post('/contacts/invite', { email: inviteEmail.trim() }); setInviteEmail(''); await loadDashboard(); toast('Invitation sent. Ask the user to sign in and accept it.'); }
    catch (error) { toast(errorMessage(error, 'Could not send invitation.'), 'error'); }
  }
  async function acceptContact(id) { try { await api.post(`/contacts/${id}/accept`); await loadDashboard(); toast('Trusted contact invitation accepted.'); } catch (e) { toast(errorMessage(e), 'error'); } }
  async function removeContact(id) { if (!window.confirm('Remove this trusted contact?')) return; try { await api.delete(`/contacts/${id}`); await loadDashboard(); toast('Trusted contact removed.'); } catch (e) { toast(errorMessage(e), 'error'); } }
  async function viewContactLocation(contact) {
    try { const response = await api.get(`/users/${contact.user.id}/location/latest`); setLocation(response.data); setActive('Live Tracking'); toast(`Showing latest location shared by ${contact.user.name}.`); }
    catch (e) { toast(errorMessage(e, 'No location is available for this contact yet.'), 'error'); }
  }
  async function sendSos() {
    if (!window.confirm('Send an SOS alert to your accepted trusted contacts?')) return;
    try { const response = await api.post('/sos', { message: 'Emergency assistance requested' }); await loadDashboard(); toast(response.data.note || 'SOS event created.'); setActive('Emergency History'); }
    catch (e) { toast(errorMessage(e, 'Could not create SOS alert.'), 'error'); }
  }
  async function createJourney(event) {
    event.preventDefault();
    try {
      const expectedArrival = arrival.length === 16 ? `${arrival}:00` : arrival;
      await api.post('/journeys', { destination: destination.trim(), expectedArrival });
      setDestination(''); setArrival(''); await loadDashboard(); toast('Safe journey started.');
    } catch (e) { toast(errorMessage(e, 'Could not start journey.'), 'error'); }
  }
  async function journeyAction(id, action) {
    try { await api.post(`/journeys/${id}/${action}`, action === 'check-in' ? { note: 'Manual check-in — I am safe.' } : {}); await loadDashboard(); toast(action === 'arrive' ? 'Journey marked as completed.' : action === 'cancel' ? 'Journey cancelled.' : 'Your check-in was recorded.'); }
    catch (e) { toast(errorMessage(e, 'Could not update journey.'), 'error'); }
  }

  const acceptedCount = contacts.filter((c) => c.status === 'ACCEPTED').length;
  const pendingCount = contacts.filter((c) => c.status === 'PENDING').length;
  const activeJourneys = journeys.filter((j) => ['ACTIVE', 'OVERDUE'].includes(j.status));
  const navItems = [
    { name: 'Dashboard', icon: Home }, { name: 'Live Tracking', icon: MapPinned },
    { name: 'Trusted Contacts', icon: Users, count: pendingCount }, { name: 'Journey Planner', icon: Route },
    { name: 'Emergency History', icon: History }, { name: 'Notifications', icon: Bell, count: notifications.length }
  ];

  if (!token) return <AuthScreen onAuthenticated={(authenticatedUser, newToken) => { setUser(authenticatedUser); setToken(newToken); toast('Welcome to SafeWay.'); }} />;

  return <div className="app-layout">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><span className="brand-mark"><ShieldCheck size={23}/></span><span>SafeWay<small>WOMEN SAFETY</small></span><button className="mobile-close" onClick={() => setMobileMenu(false)}><X/></button></div>
      <div className="side-section-label">WORKSPACE</div>
      <nav>{navItems.map(({ name, icon: Icon, count }) => <button key={name} className={`nav-item ${active === name ? 'selected' : ''}`} onClick={() => { setActive(name); setMobileMenu(false); }}><Icon size={18}/><span>{name}</span>{count > 0 && <b className="nav-count">{count}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="side-help"><div className="help-icon"><Heart size={17}/></div><b>Need urgent help?</b><p>For emergencies in India, call 112.</p><a href="tel:112">Call emergency services <ArrowRight size={13}/></a></div><button className="nav-item logout-item" onClick={logout}><LogOut size={18}/><span>Sign out</span></button></div>
    </aside>
    {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenu(false)}/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileMenu(true)}><Menu/></button><div><span className="crumb">Workspace</span><ChevronRight size={13}/><b>{active}</b></div></div><div className="topbar-right"><button className="top-icon" onClick={() => setActive('Notifications')} title="Notifications"><Bell size={18}/>{notifications.length > 0 && <i/>}</button><div className="user-chip"><span className="avatar">{initials(user?.name)}</span><span><b>{user?.name || 'SafeWay User'}</b><small>Member account</small></span></div></div></header>
      <div className="page-content">
        <div className="page-heading"><div><span className="eyebrow">YOUR PERSONAL SAFETY SPACE</span><h1>{active === 'Dashboard' ? `Hello, ${user?.name?.split(' ')[0] || 'there'} 👋` : active}</h1><p>{active === 'Dashboard' ? 'You are in control. Your safety network is just a tap away.' : pageDescription(active)}</p></div><button className="outline-btn refresh-btn" onClick={refresh} disabled={loading}><RefreshCw size={16} className={loading ? 'spin' : ''}/> Refresh</button></div>
        {notice && <div className={`toast ${notice.type}`}><span>{notice.type === 'error' ? <CircleAlert size={18}/> : <CheckCircle2 size={18}/>}</span>{notice.text}<button onClick={() => setNotice(null)}><X size={16}/></button></div>}

        {active === 'Dashboard' && <>
          <section className="welcome-banner"><div className="banner-copy"><span className="banner-pill"><ShieldCheck size={13}/> SAFEWAY SAFETY NETWORK</span><h2>Your safety.<br/><em>Your people. Your choice.</em></h2><p>Stay connected with the people you trust. Share your location when you need to, and keep your journeys in view.</p><button onClick={() => setActive('Live Tracking')} className="banner-btn">Open live tracking <ArrowRight size={16}/></button></div><div className="banner-art"><div className="banner-circle circle-a"/><div className="banner-circle circle-b"/><div className="banner-shield"><ShieldCheck size={94}/></div><div className="banner-pin"><MapPin size={21}/></div><div className="banner-heart"><Heart size={19} fill="currentColor"/></div></div></section>
          <div className="stats-grid">
            <StatCard icon={Users} label="Trusted contacts" value={acceptedCount} hint={`${pendingCount} pending invitation${pendingCount === 1 ? '' : 's'}`} tone="violet"/>
            <StatCard icon={Navigation} label="Location sharing" value={sharing ? 'Active' : 'Off'} hint={sharing ? 'GPS updates enabled' : 'Not currently sharing'} tone="green"/>
            <StatCard icon={Route} label="Active journeys" value={activeJourneys.length} hint="Journeys being monitored" tone="orange"/>
            <StatCard icon={BatteryFull} label="Device battery" value={batterySupported && battery ? `${battery.level}%` : '—'} hint={!batterySupported ? 'Not supported by browser' : battery?.charging ? 'Connected to power' : 'Latest browser reading'} tone="blue"/>
          </div>
          <div className="dashboard-grid">
            <section className="card map-card"><CardTitle icon={MapPinned} title="Your current location" subtitle="Most recent position uploaded to SafeWay" action={<button className="text-btn" onClick={() => setActive('Live Tracking')}>View details <ArrowRight size={14}/></button>}/><LocationMap location={location}/><div className="map-meta"><span><span className={`status-dot ${sharing ? 'live' : ''}`}/>{sharing ? 'Sharing is active' : 'Sharing is off'}</span><span><Clock3 size={14}/>{formatDate(location?.recordedAt)}</span></div></section>
            <section className="card battery-card"><CardTitle icon={BatteryFull} title="Device battery" subtitle="Battery status from this browser"/><BatteryPanel battery={battery} supported={batterySupported} updated={batteryUpdated}/><div className="battery-note"><CircleAlert size={15}/> Low battery alerts are generated at 20% or below when a report reaches the server.</div></section>
            <section className="card quick-card"><CardTitle icon={Activity} title="Quick actions" subtitle="Common safety tools"/><div className="quick-actions"><QuickAction icon={MapPinned} title="Share location" text="Start or stop GPS" tone="green" onClick={() => setActive('Live Tracking')}/><QuickAction icon={Users} title="Trusted contacts" text="Manage your people" tone="violet" onClick={() => setActive('Trusted Contacts')}/><QuickAction icon={Route} title="Safe journey" text="Plan a trip" tone="orange" onClick={() => setActive('Journey Planner')}/><QuickAction icon={History} title="Safety history" text="Review past events" tone="blue" onClick={() => setActive('Emergency History')}/></div></section>
            <section className="card sos-card"><div className="sos-icon"><Siren size={25}/></div><div><span className="eyebrow">EMERGENCY SUPPORT</span><h3>Need help right now?</h3><p>Create an SOS event to notify your accepted trusted contacts inside the app.</p><button className="sos-button" onClick={sendSos}>Create SOS alert <ArrowRight size={16}/></button><small>This prototype does not call emergency services or send SMS.</small></div></section>
          </div>
        </>}

        {active === 'Live Tracking' && <div className="content-grid two-col"><section className="card"><CardTitle icon={MapPinned} title="Live location sharing" subtitle="Share your GPS position with accepted trusted contacts"/><div className="tracking-state"><div className={`tracking-pulse ${sharing ? 'is-live' : ''}`}><LocateFixed size={27}/></div><div><b>{sharing ? 'Location sharing is active' : 'Location sharing is stopped'}</b><span>{sharing ? 'Your browser is sending location updates.' : 'Start sharing when you want trusted contacts to see your location.'}</span></div></div><div className="button-row">{!sharing ? <button className="primary-btn" onClick={startSharing}><Navigation size={17}/> Start sharing location</button> : <button className="danger-btn" onClick={stopSharing}><XCircle size={17}/> Stop location sharing</button>}</div><div className="privacy-box"><ShieldCheck size={18}/><p>Location sharing is under your control. Keep this page open. Browser background tracking is not guaranteed.</p></div><div className="location-coordinates"><div><span>Latitude</span><b>{location?.latitude ?? '—'}</b></div><div><span>Longitude</span><b>{location?.longitude ?? '—'}</b></div><div><span>Accuracy</span><b>{location?.accuracy ? `${Math.round(location.accuracy)} m` : '—'}</b></div></div></section><section className="card map-large-card"><CardTitle icon={MapPin} title="Map view" subtitle="Latest successfully uploaded location"/><LocationMap location={location} large/></section></div>}

        {active === 'Trusted Contacts' && <div className="content-grid two-col"><section className="card"><CardTitle icon={Users} title="Add a trusted contact" subtitle="Invite someone who already has a SafeWay account"/><form className="stack-form" onSubmit={inviteContact}><label>Registered email address<div className="input-wrap"><Mail size={17}/><input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="friend@example.com" required/></div></label><button className="primary-btn"><Plus size={17}/> Send invitation</button></form><div className="info-note"><CircleAlert size={17}/> The current backend identifies registered users by email. Phone-number invitations need a matching backend update.</div></section><section className="card"><CardTitle icon={ShieldCheck} title="Your safety network" subtitle={`${acceptedCount} accepted · ${pendingCount} pending`}/>{contacts.length === 0 ? <EmptyState icon={Users} title="No trusted contacts yet" text="Invite someone you trust to build your safety network."/> : <div className="list-stack">{contacts.map((contact) => <ContactRow key={contact.id} contact={contact} onAccept={acceptContact} onRemove={removeContact} onView={viewContactLocation}/>)}</div>}</section></div>}

        {active === 'Journey Planner' && <div className="content-grid two-col"><section className="card"><CardTitle icon={Route} title="Plan a safe journey" subtitle="Tell your trusted contacts where you are heading"/><form className="stack-form" onSubmit={createJourney}><label>Destination<input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. College, home, office" required/></label><label>Expected arrival date & time<input type="datetime-local" value={arrival} min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} onChange={(e) => setArrival(e.target.value)} required/></label><button className="primary-btn"><Route size={17}/> Start safe journey</button></form><div className="info-note"><Clock3 size={17}/> The backend checks overdue journeys. The configured grace period is 15 minutes.</div></section><section className="card"><CardTitle icon={Clock3} title="Your journeys" subtitle="Check in or update your journey status"/>{journeys.length === 0 ? <EmptyState icon={Route} title="No journeys yet" text="Your planned journeys will appear here."/> : <div className="list-stack">{journeys.map((journey) => <JourneyRow key={journey.id} journey={journey} onAction={journeyAction}/>)}</div>}</section></div>}

        {active === 'Emergency History' && <div className="card"><CardTitle icon={History} title="Emergency history" subtitle="A record of SOS events created from your account"/>{sosHistory.length === 0 ? <EmptyState icon={ShieldAlert} title="No SOS events recorded" text="When you create an SOS alert, it will appear here."/> : <div className="table-wrap"><table><thead><tr><th>Event</th><th>Status</th><th>Created</th></tr></thead><tbody>{sosHistory.map((item) => <tr key={item.id}><td><b>SOS #{item.id}</b></td><td><span className="status-tag danger-tag">{item.status}</span></td><td>{formatDate(item.createdAt)}</td></tr>)}</tbody></table></div>}</div>}

        {active === 'Notifications' && <div className="card"><CardTitle icon={Bell} title="Safety notifications" subtitle="Updates from your trusted network"/>{notifications.length === 0 ? <EmptyState icon={Bell} title="You're all caught up" text="Invitations, SOS alerts, low-battery and journey updates will appear here."/> : <div className="list-stack">{notifications.map((item) => <div className="notification-row" key={item.id}><div className="notification-icon"><Bell size={18}/></div><div><b>{item.type?.replaceAll('_', ' ') || 'Safety update'}</b><p>{item.message}</p><small>{formatDate(item.createdAt)}</small></div></div>)}</div>}</div>}

        <footer className="page-footer"><span><ShieldCheck size={15}/> SafeWay · Consent-based safety tools</span><span>Prototype only · Not a replacement for emergency services</span></footer>
      </div>
    </main>
  </div>;
}

function pageDescription(page) {
  return ({ 'Live Tracking': 'Choose when to share your location with the people you trust.', 'Trusted Contacts': 'Build and manage your personal safety network.', 'Journey Planner': 'Plan journeys and let your trusted contacts know when you expect to arrive.', 'Emergency History': 'Review SOS events created from your account.', 'Notifications': 'See important updates from your SafeWay network.' })[page] || 'Manage your personal safety tools.';
}
function StatCard({ icon: Icon, label, value, hint, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div>; }
function CardTitle({ icon: Icon, title, subtitle, action }) { return <div className="card-title"><div className="card-title-icon"><Icon size={18}/></div><div><h3>{title}</h3><p>{subtitle}</p></div>{action && <div className="card-action">{action}</div>}</div>; }
function LocationMap({ location, large = false }) {
  if (!location || location.latitude == null || location.longitude == null) return <div className={`map-placeholder ${large ? 'large' : ''}`}><div className="map-placeholder-icon"><MapPinned size={27}/></div><b>No location available yet</b><span>Start GPS sharing to upload your current position.</span></div>;
  return <div className={`map-frame ${large ? 'large' : ''}`}><MapContainer center={[location.latitude, location.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><MapRecenter position={location}/><Marker position={[location.latitude, location.longitude]} icon={markerIcon}><Popup>{location.user?.name || 'Latest shared location'}</Popup></Marker></MapContainer></div>;
}
function BatteryPanel({ battery, supported, updated }) {
  if (!supported) return <div className="battery-unavailable"><Smartphone size={27}/><b>Battery API unavailable</b><span>This browser or device does not expose battery status. GPS and other safety features can still be used.</span></div>;
  if (!battery) return <div className="battery-unavailable"><BatteryFull size={27}/><b>Waiting for battery reading</b><span>Allow the browser to read battery status, if supported.</span></div>;
  const low = battery.level <= 20;
  const Icon = battery.charging ? BatteryCharging : low ? BatteryLow : BatteryFull;
  return <div className="battery-reading"><div className={`battery-main ${low ? 'low' : ''}`}><div className="battery-glyph"><Icon size={31}/></div><div><strong>{battery.level}<small>%</small></strong><span>{battery.charging ? 'Charging' : low ? 'Low battery' : 'Battery remaining'}</span></div></div><div className="battery-track"><div className={`battery-fill ${low ? 'low' : ''}`} style={{ width: `${battery.level}%` }}/></div><div className="battery-scale"><span>0%</span><span>20% low alert</span><span>100%</span></div><div className={`battery-status ${low ? 'low' : ''}`}>{low ? <><CircleAlert size={15}/> Low battery — trusted contacts may receive an in-app alert when this reading is reported.</> : <><CheckCircle2 size={15}/> {battery.charging ? 'Your device is connected to power.' : 'Battery level is above the low-battery threshold.'}</>}</div><small className="updated-time">Last reading: {formatDate(updated)}</small></div>;
}
function QuickAction({ icon: Icon, title, text, tone, onClick }) { return <button className="quick-action" onClick={onClick}><span className={`quick-icon ${tone}`}><Icon size={19}/></span><span><b>{title}</b><small>{text}</small></span><ChevronRight size={17}/></button>; }
function EmptyState({ icon: Icon, title, text }) { return <div className="empty-state"><span><Icon size={25}/></span><b>{title}</b><p>{text}</p></div>; }
function ContactRow({ contact, onAccept, onRemove, onView }) {
  const incoming = contact.direction === 'INCOMING'; const accepted = contact.status === 'ACCEPTED';
  return <div className="contact-row"><div className="avatar contact-avatar">{initials(contact.user?.name)}</div><div className="contact-details"><b>{contact.user?.name || 'SafeWay member'}</b><span>{contact.user?.email}</span><small>{incoming ? 'Invitation received' : 'Invitation sent'} · {contact.status}</small></div><div className="contact-actions">{incoming && !accepted && <button className="small-primary" onClick={() => onAccept(contact.id)}><Check size={14}/> Accept</button>}{accepted && <button className="small-outline" onClick={() => onView(contact)}><MapPin size={14}/> Location</button>}<button className="icon-danger" onClick={() => onRemove(contact.id)} title="Remove contact"><Trash2 size={16}/></button></div></div>;
}
function JourneyRow({ journey, onAction }) {
  const active = ['ACTIVE', 'OVERDUE'].includes(journey.status);
  return <div className="journey-row"><div className="journey-top"><div className="journey-destination"><span className="journey-pin"><MapPin size={17}/></span><div><b>{journey.destination}</b><small>Expected arrival: {formatDate(journey.expectedArrival)}</small></div></div><span className={`status-tag ${journey.status === 'OVERDUE' ? 'danger-tag' : journey.status === 'COMPLETED' ? 'success-tag' : 'neutral-tag'}`}>{journey.status}</span></div>{journey.lastCheckIn && <p className="last-checkin"><CheckCircle2 size={14}/> {journey.lastCheckIn}</p>}{active && <div className="journey-actions"><button className="small-primary" onClick={() => onAction(journey.id, 'check-in')}><Check size={14}/> Check in</button><button className="small-outline" onClick={() => onAction(journey.id, 'arrive')}>Mark arrived</button><button className="small-text-danger" onClick={() => onAction(journey.id, 'cancel')}>Cancel</button></div>}</div>;
}

export default App;
